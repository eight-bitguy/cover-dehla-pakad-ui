export default class Url {

    static get LandingPage() {
        return '/home';
    }

    static GamePage = (roomCode) => {
        return `/game/${roomCode ? roomCode : ':roomCode'}`;
    };

    static JoiningGame = (roomCode) => {
        return `/joining/${roomCode ? roomCode : ':roomCode'}`;
    };

    static get Register() {
        return '/register';
    }

    static get Login() {
        return '/login';
    }

    static get Home() {
        return '/';
    }
}
