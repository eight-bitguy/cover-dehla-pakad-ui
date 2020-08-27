import {store} from "../index";
import User from "../Models/user";
import {addCardsInHand} from "../Redux/modules/cards";
import {addUser} from "../Redux/modules/users";
import {addUsersInRoom} from "../Redux/modules/roomUsers";
import {getJoinedUses, joinRoom} from "../Api/room";
import {addRoom} from "../Redux/modules/room";
import {batch} from "react-redux";

/**
 *
 * @param array1
 * @param array2
 * @param keyAttribute
 * @returns {unknown[]}
 */
export function mergeBasedOnAttribute(array1, array2, keyAttribute) {
    const mergedRecords = {};
    array1.forEach((record) => {
        mergedRecords[record[keyAttribute]] = record;
    });
    array2.forEach((records) => {
        if (mergedRecords[records[keyAttribute]]) {
            mergedRecords[records[keyAttribute]] = {...mergedRecords[records[keyAttribute]], ...records};
        }
        else {
            mergedRecords[records[keyAttribute]] = records;
        }
    });
    return Object.values(mergedRecords);
}

/**
 *
 * @returns {boolean}
 */
export function isLoggedIn() {
    const tokenFromLocalStorage = window.getToken();
    return !!getLoggedInUser() || tokenFromLocalStorage;
}

/**
 *
 * @returns {*}
 */
export function getLoggedInUser() {
    const reduxStore = getStore();
    const { users, additionalInfo } = reduxStore;
    return users.find(user => +user.id === +additionalInfo.loggedInUserId);
}

/**
 *
 * @returns {*}
 */
export function getCurrentRoom() {
    const reduxStore = getStore();
    return reduxStore.room;
}

/**
 *
 * @returns {*}
 */
function getRoomUserModels() {
    const reduxStore = getStore();
    return reduxStore.roomUsers;
}

/**
 *
 * @returns {{}}
 */
function getStore() {
    return store.getState();
}

/**
 *
 * @param roomCode
 * @returns {*}
 */
function getRoomUser(roomCode) {
    const { users } = getStore();
    const roomUserModels = getRoomUserModels(roomCode);
    const roomUserModelIds = roomUserModels.map(roomUser => +roomUser.userId);

    return users.filter(user => roomUserModelIds.includes(user.id));
}

/**
 *
 * @returns {*}
 */
export function getCurrentRoomUsers() {
    const currentRoom = getCurrentRoom();
    if (currentRoom) {
        return getRoomUser(currentRoom.code);
    }
    return [];
}

/**
 *
 * @returns {boolean}
 */
export function isUserCurrentRoomAdmin() {
    const {roomUsers} = getStore();
    const currentRoom = getCurrentRoom();
    const user = getLoggedInUser();

    if (!currentRoom) {
        return false;
    }

    return !!(roomUsers.find(roomUser =>
        +roomUser.userId === user.id &&
        roomUser.roomCode === currentRoom.code &&
        roomUser.position === User.ROOM_USER_POSITION
    ));
}

/**
 *
 * @param card
 */
export function removeCardFromHand(card)
{
    const {cards} = getStore();
    const currentHand = cards.hand;
    currentHand.splice(currentHand.indexOf(card), 1);
    store.dispatch(addCardsInHand(currentHand));
}

/**
 *
 * @returns {*}
 */
export function getCurrentRoomUserModels() {
    const currentRoom = getCurrentRoom();
    if (currentRoom) {
        return getRoomUserModels(currentRoom.code);
    }
}

/**
 *
 * @returns {*}
 */
export function myPositionInCurrentRoom() {
    const {additionalInfo, roomUsers} = getStore();
    return roomUsers && roomUsers.length ?
        (roomUsers.find(user => +user.userId === +additionalInfo.loggedInUserId).position || '' ): '';
}

/**
 *
 * @returns {boolean}
 */
export function isMyChance() {
    const {additionalInfo} = getStore();
    return additionalInfo.nextChance === myPositionInCurrentRoom();
}

/**
 * Handle new player join event
 * @param {Array} users
 * @returns {Promise<void>}
 */
export async function joinNewUsers(users) {
    const roomUsers = users.map(user => ({
        name: user.name,
        userId: user.id,
        email: user.email,
        position: user['room_users'].data.position,
    }));
    users.forEach((user, index) => {
        delete users[index]['room_users'];
    });

    await batch(async () => {
        await store.dispatch(addUser(users));
        await store.dispatch(addUsersInRoom(roomUsers));
    });
}

/**
 * Add already joined users
 * @param roomCode
 * @returns {Promise<void>}
 */
export async function addAlreadyJoinedUsers(roomCode) {
    const { data: joinedUsers } = await getJoinedUses(roomCode);
    await joinNewUsers(joinedUsers);
}

/**
 * Fetch room details if not available
 * @param roomCode
 * @returns {Promise<void>}
 */
export async function fetchRoomDetailsIfNotAvailable(roomCode) {
    const {rooms} = getStore();
    const requiredRoom = rooms.find(room => room.code === roomCode);
    if (!requiredRoom) {
        await joinRoomWithRoomCode(roomCode);
    }
}

/**
 *
 * @param roomCode
 * @returns {Promise<boolean>}
 */
export async function joinRoomWithRoomCode(roomCode) {
    const response = await joinRoom(roomCode);
    if (!response || !response.data) {
        return false;
    }

    const roomDetails = response.data;

    await batch(async () => {
        await store.dispatch(addRoom(roomDetails));
    });

    return true;
}

/**
 *
 * @param users
 * @param roomCode
 * @returns {*}
 */
export function getUsersWithPosition(users, roomCode) {
    if (!users) {
        return [];
    }
    const { roomUsers } = getStore();
    return users.map(user => {
        user.roomUser = roomUsers.find(roomUser => +roomUser.userId === user.id && roomUser.roomCode === roomCode);
        return user;
    });
}
