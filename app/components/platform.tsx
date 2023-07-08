import React, { useState } from 'react'
import 'animate.css'
import Dropdown from './dropdown'
import Select, { ClassNamesConfig, OptionProps, SingleValue, components } from "react-select";
import clsx from 'clsx';

type Props = {
    playlists: Playlist[]
    platform: "spotify" | "youtube"
    inputValue: string
}


const selectClasses: ClassNamesConfig<Playlist, false> = {
    control: (state) =>
        clsx(
            'rounded-full pr-5 pl-11 py-3 h-12 transition',
            state.isFocused ? 'border-gradient' : 'border-none',
        ),
    menu: () => 'rounded-2xl bg-gray-800 p-2 mt-3 animate__animated animate__fadeInDown animate__faster',
    option: (state) => clsx(
        'hover:bg-gray-900 w-full rounded-xl py-2 px-3 transition',
        state.isSelected ? "font-semibold" : ""
    )
}

const Platform = ({ playlists, platform, inputValue }: Props) => {

    const Option = ({ children, ...props }: OptionProps<Playlist, false>) => {
        return (
            <components.Option {...props}>
                {children}

                <i className="fa-solid fa-check"></i>
            </components.Option>
        );
    };

    const LogoImg = () => {
        let imgLink: string = ""

        if (platform == "youtube") {
            // imgLink = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/YouTube_Logo_2017.svg/1200px-YouTube_Logo_2017.svg.png"
            imgLink = "https://freelogopng.com/images/all_img/1656501415youtube-png-logo.png"
        } else {
            imgLink = "https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Green.png"
        }

        return <img src={imgLink} alt="" className='row-span-1 row-start-2 max-w-xs animate__animated animate__fadeInUp animate__faster' />
    }


    return (
        <div className='grid grid-rows-3 h-full justify-center items-end'>
            <LogoImg />


            {/* <div className="input-group relative row-span-1 row-start-3">
                <div className=''>
                    <i className="fa-solid fa-magnifying-glass absolute inset-y-0 top-4 left-4 z-50"></i>
                    <Select
                        options={playlists}
                        getOptionLabel={(playlist: Playlist) => playlist.name}
                        getOptionValue={(playlist: Playlist) => playlist.name}
                        components={{ Option }}
                        unstyled
                        isClearable
                        isSearchable
                        defaultInputValue={inputValue}
                        placeholder={<p className='text-gray-500'>Find a playlist...</p>}
                        className='text-white bg-gray-800 rounded-full tracking-wide'
                        // components={{ Option: SelectedOption }}
                        classNames={selectClasses}
                        id={`playlists-${platform}`}
                        onChange={(option) => handleChange(option)}
                    />
                    <i className="fa-solid fa-caret-down absolute inset-y-0 right-5 top-4 pointer-events-none"></i>
                </div>

            </div> */}
            <Dropdown playlists={playlists} platform={platform} inputValue={inputValue} />

        </div>
    )
}

export default Platform;