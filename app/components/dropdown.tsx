import clsx from 'clsx';
import React, { useState } from 'react';
import Select, { ClassNamesConfig, ControlProps, OptionProps, SingleValue, components } from "react-select";

type Props = {
    playlists: Playlist[],
    platform: "spotify" | "youtube"
    inputValue: string
}

// const Option = ({children, ...props}: OptionProps) => {
//     return (
//         <components.Option {...props}>
//             {children} <i className="fa-solid fa-check"></i>
//         </components.Option>
//     )
// }

type IsMulti = false;

// const [ selectedOption, setSelectOption ] = useState(null)

const SelectedOption = ({ children, isSelected }: any) => (
    <div>
        {children}
        {isSelected && (
            <i className="fa-solid fa-check"></i>
        )}
    </div>
);

// text-white rounded-full px-11 py-3 h-12 bg-gray-800 tracking-wide outline-none w-full
const selectClasses: ClassNamesConfig<Playlist, IsMulti> = {
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

export default function Dropdown({ playlists, platform, inputValue }: Props) {
    console.log("inputValue: ", inputValue)
    
    const Option = ({ children, ...props }: OptionProps<Playlist, IsMulti>) => {
        if (props.isSelected) {
            return (
                <components.Option {...props}>
                    {children}
        
                    <i className="fa-solid fa-check float-right mt-1"></i>
                </components.Option>
            );
        } else {
            return (
                <components.Option {...props}>
                    {children}
                </components.Option>
            )
        }
        
    };
    
    return (
        <div className="input-group relative row-span-1 row-start-3">
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
                />
                {/* <i className="fa-solid fa-caret-down absolute inset-y-0 right-5 top-4 pointer-events-none"></i> */}
            </div>

        </div>
    )
}
