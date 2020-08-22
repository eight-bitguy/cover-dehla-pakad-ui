export default class Url {
    static get LandingPage() {
        return '/home';
    }

    static get GamePage() {
        return '/game';
    }

    static JoiningGame = (roomCode) => {
        return `/joining/${roomCode ? roomCode : ':roomCode'}`;
    };

    static get Register() {
        return '/register';
    }

    static get Login() {
        return '/login';
    }
}
