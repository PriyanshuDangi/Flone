import React, { useState } from 'react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import styleClasses from './styles.module.css';

const VolumeSlider = ({ bgVolume, setBgVolume, footVolume, setFootVolume }) => {
    const handleVolumeChange = (event, value) => {
        setBgVolume(value);
    };

    const handleMasterChange = (event, value) => {
        setFootVolume(value);
    };

    const sliderStyle = {
        color: '#000',
        height: 150,
        flex: '1',
        width: 8,
        '& .MuiSlider-thumb': {
            width: 20,
            height: 12,
            transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
            '&:before': {
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
            },
            '&:hover, &.Mui-focusVisible': {
                boxShadow: `0px 0px 0px 8px rgb(0 0 0 / 16%)`,
            },
            '&.Mui-active': {
                width: 20,
                height: 20,
            },
        },
        '& .MuiSlider-rail': {
            opacity: 0.28,
        },
    };

    return (
        <div className={styleClasses.container}>
            <span>Media</span>
            <div className={styleClasses.info}>
                <div className="d-flex flex-column align-items-center gap-2" style={{ height: '150px' }}>
                    <Slider
                        value={bgVolume}
                        onChange={handleVolumeChange}
                        aria-label="musicVolume-slider"
                        valueLabelDisplay="auto"
                        orientation="vertical"
                        sx={sliderStyle}
                    />
                    <MusicNoteIcon />
                </div>
                <div className="d-flex flex-column align-items-center gap-2" style={{ height: '150px' }}>
                    <Slider
                        value={footVolume}
                        onChange={handleMasterChange}
                        aria-label="musicVolume-slider"
                        valueLabelDisplay="auto"
                        orientation="vertical"
                        sx={sliderStyle}
                    />
                    <VolumeDownIcon />
                </div>
            </div>
        </div>
    );
};

export default VolumeSlider;
