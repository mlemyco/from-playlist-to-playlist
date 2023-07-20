import React from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import Select, { ClassNamesConfig, MenuProps, OptionProps, SingleValue, components } from 'react-select';
import CreatableSelect from 'react-select/creatable';

type Props = {
    currentState: PlatformState
    setState: Function
}

// text-white rounded-full px-11 py-3 h-12 bg-gray-800 tracking-wide outline-none w-full
const selectClasses: ClassNamesConfig<Playlist, false> = {
    control: (state) =>
        clsx(
            'rounded-full pr-5 pl-11 py-3 h-12 transition',
            state.isFocused ? 'border-gradient' : 'border-none',
        ),
    menu: () => 'rounded-2xl bg-gray-800 p-2 mt-3 z-100',
    option: (state) => clsx(
        'hover:bg-gray-900 w-full rounded-xl py-2 px-3 transition',
        state.isSelected && "font-semibold"
    )
}

const Dropdown = ({ currentState, setState }: Props) => {
    const getOptionLabelValue = (playlist: Playlist) => {
        return playlist.snippet ? playlist.snippet.title : playlist.name
    }

    const Menu = ({ children, ...props }: MenuProps<Playlist, false>) => {
        return (
            <AnimatePresence mode='wait'>
                <motion.div
                    initial={{ 
                        opacity: 0,
                        y: -60
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    exit={{
                        opacity: 1,
                        y: -60
                    }}
                >
                    <components.Menu {...props}>
                        {children}
                    </components.Menu>
                </motion.div>
            </AnimatePresence>
        )
    }

    const Option = ({ children, ...props }: OptionProps<Playlist, false>) => {
        return (
            <components.Option {...props}>
                <div className="relative">
                    {children}

                    {props.isSelected && <i className="fa-solid fa-check absolute top-1/2 -translate-y-1/2 right-0"></i>}
                </div>
            </components.Option>
        )
    };

    const handleChange = (newValue: SingleValue<Playlist>) => {
        setState((prevState: PlatformState) => {
            return {
                ...prevState,
                inputPlaylist: newValue
            }
        })

        console.log("new:", newValue)
    }

    return (
        <div className='relative my-5'>
            <i className="fa-solid fa-magnifying-glass absolute inset-y-0 top-4 left-4 z-50"></i>

            <Select
                instanceId={`${currentState.platform}-dropdown`}
                options={currentState.playlists}
                getOptionLabel={getOptionLabelValue}
                getOptionValue={getOptionLabelValue}
                components={{ Option, Menu }}
                unstyled
                isClearable
                isSearchable
                placeholder={<p className='text-gray-500'>Find a playlist...</p>}
                className='text-white bg-gray-800 rounded-full tracking-wide max-w-xs w-100'
                classNames={selectClasses}
                id={`playlists-${currentState.platform}`}
                onChange={handleChange}
                noOptionsMessage={() => <p className='text-gray-500'>No playlists found</p>}
                value={currentState.inputPlaylist}
            />
        </div>
    )
}

export default Dropdown;
