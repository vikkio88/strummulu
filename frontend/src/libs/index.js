import { Howl } from 'howler';

export const preloadAssets = () => {
    const images = [
        '/assets/bullet.svg',
        '/assets/defend.svg',
        '/assets/reload.svg',
        '/assets/shoot.svg',
    ];

    const audio = [
        '/assets/music/defend.mp3',
        '/assets/music/shoot.mp3',
        '/assets/music/reload.mp3',
    ];

    images.forEach(imgUrl => {
        const img = new Image();
        img.src = imgUrl;
    });

    audio.forEach(audioUrl => {
        const audio = new Audio();
        audio.src = audioUrl;
        audio.preload = true;
    });
};

export const playSounds = sounds => {
    const first = new Howl({ src: [`/assets/music/${sounds[0]}.mp3`] });
    const second = new Howl({ src: [`/assets/music/${sounds[1]}.mp3`] });
    first.play();
    first.on('end', () => {
        second.play();
    });
};