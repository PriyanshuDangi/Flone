import React, { useEffect } from 'react';
import LogoImg from '../../assets/images/2242.png';
import styleClass from './styles.module.css';

let id = 'explodingObject';
let expolidingContainer = document.getElementById(id);

const ExplodingObject = () => {
    function getRandomColor(type) {
        let letters = '';
        if (type === 'surface') {
            letters = '3456789ABC';
        } else if (type === 'background') {
            letters = '0123456789ABCDEF';
        } else {
            letters = '01EF';
        }
        var color = '';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * letters.length)];
        }
        return color;
    }

    useEffect(() => {
        // console.log(window.explosion);
        let animation = new window.explosion.default(
            id, // id of DOM el
            {
                // surface: '666666',
                // inside: '98e898',
                background: '151616',
                surface: getRandomColor('surface'),
                inside: getRandomColor('inside'),
                // background: getRandomColor('background'),
                onLoad: () => {
                    // document.body.classList.remove('loading');
                },
            },
        );

        let targetMouseX = 0,
            mouseX = 0,
            ta = 0;
        const sign = function (n) {
            return n === 0 ? 1 : n / Math.abs(n);
        };

        const handleMouseMove = (e) => {
            targetMouseX = (2 * (e.clientX - animation.width / 2)) / animation.width;
        };

        const handleTouchMove = (e) => {
            targetMouseX = (e.touches[0].clientX / animation.width) * 2 - 1;
        };

        let animationFrame;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchmove', handleTouchMove);

        function draw() {
            if (animation) {
                mouseX += (targetMouseX - mouseX) * 0.05;
                ta = Math.abs(mouseX);
                animation.settings.progress = ta;
                animation.scene.rotation.y = Math.PI / 2 - ta * (2 - ta) * Math.PI * sign(mouseX);
                animation.scene.rotation.z = Math.PI / 2 - ta * (2 - ta) * Math.PI * sign(mouseX);
            }
            animationFrame = window.requestAnimationFrame(draw);
        }
        draw();

        return () => {
            cancelAnimationFrame(animationFrame);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('touchmove', handleTouchMove);
            expolidingContainer.removeChild(expolidingContainer.childNodes[0]);
        };
    });

    return (
        <div className={styleClass.logo}>
            <div>
                <div className={styleClass.title}>
                    <img src={LogoImg} alt="logo" />
                </div>
                <div className={styleClass.links}></div>
            </div>
        </div>
    );
};

export default ExplodingObject;
