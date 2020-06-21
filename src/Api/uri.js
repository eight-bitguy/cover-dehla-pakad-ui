export default class Uri {

    static get apiUrl() {
        return window.apiUrl();
    }

    static get prefix() {
        return `${Uri.apiUrl}/api`;
    }

    static get register() {
        return `${Uri.prefix}/user`;
    }

    static get getMe() {
        return `${Uri.prefix}/user/me`;
    }

    static get login() {
        return `${Uri.prefix}/login`;
    }

    static get creatRoom() {
        return `${Uri.prefix}/room`;
    }

    static joinRoom = (roomCode) => {
        return `${Uri.prefix}/room/${roomCode}/join`;
    };

    static startRoom = (roomCode) => {
        return `${Uri.prefix}/room/${roomCode}/start`;
    };

    static getJoinedUsers = (roomCode) => {
        return `${Uri.prefix}/room/${roomCode}/users`;
    };

    static initialCards = (roomCode) => {
        return `${Uri.prefix}/room/${roomCode}/user/initial-cards`;
    };

    static play = (roomCode) => {
        return `${Uri.prefix}/room/${roomCode}/play`;
    }
}
