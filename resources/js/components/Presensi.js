import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Presensi = (props) => {
    const initialState = () => {
        return {
            nrp: '',
            nama: '',
            asal: '',
        };
    };

    const [events, setEvents] = useState(JSON.parse(window.__INITIAL_STATE__));
    const [inputs, setInputs] = useState(initialState);

    const handleInputChange = (event) => {
        event.persist();
        const target = event.target;

        if(target.name === 'nrp') {
            const regexcheck = new RegExp('^[0-9]*$');
            if(target.value.length <= 14 && regexcheck.test(target.value)){
                setInputs(inputs => ({...inputs, [target.name]: target.value}));
            }
        } else {
            setInputs(inputs => ({...inputs, [target.name]: target.value}));
        }

    };

    const handleSubmit = event => {
        event.preventDefault();

        if(events.type === 'Mahasiswa' && inputs.nrp.length !== 14) {
            console.error("mahasiswa error");
            return;
        } else if (events.type !== 'Mahasiswa' && (inputs.nama.length === 0 || inputs.asal.length === 0)) {
            console.error("umum error");
            return;
        }

        axios.put(events.endpoint, inputs)
        .then(response => {
            // console.log(response);
            MySwal.fire({
                title: 'Welcome',
                text: 'Hi ' + response.data.nama + '! Jesus bless you!',
                type: 'success',
                timer: 2500,
            });
            if(events.show_attendance_count === 1) {
                setEvents(events => ({...events, attendance_count: response.data.attendance_count}));
                console.log('masuk attendance');
            }
            setInputs(initialState());
            document.forms[0].elements[0].focus();
        }).catch(error => {
            console.error(error);
            MySwal.fire({
                title: 'Oops!',
                text: 'Oopsie, something wrong is happening!',
                type: 'error',
                timer: 2500,
            });
        })
    };

    const handleKeyDown = e => {
        if(e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <div className="container mx-auto h-full flex flex-col justify-center items-center">
            <div className="w-2/3">
                {/*<h1 className="font-normal text-3xl mb-6 text-center">{events.title}</h1>*/}
                <div className="max-w-sm w-full lg:max-w-full lg:flex" style={{height: '50vh'}}>
                    <img src={events.background_image || 'https://source.unsplash.com/300x300/daily/?texture,featured'}
                         className="w-auto lg:h-full object-cover flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l overflow-hidden" crossOrigin={"anonymous"}/>
                    <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal w-full">
                        <div className="h-full flex flex-col justify-center items-center">
                            <h1 className="text-xl lg:text-3xl font-bold text-center">{events.title}</h1>
                            <h2 className="text-lg lg:text-xl font-light text-center">{events.description}</h2>
                            <h2 className="text-lg lg:text-xl font-light text-center">{(events.show_attendance_count) ? `Total: ${events.attendance_count}` : ''}</h2>
                            <div className="h-full w-50 flex flex-col justify-center items-center">
                                <form onSubmit={handleSubmit} id={'form-input'}>
                                    {(events.type === 'Mahasiswa') ? (
                                        <input onChange={handleInputChange} name="nrp" value={inputs.nrp} placeholder="NRP"
                                               className="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-2 py-2 rounded shadow text-lg"/>
                                    ) : (
                                        <>
                                            <input id={"form-nama"} onChange={handleInputChange} name="nama" value={inputs.nama} placeholder={"Nama"}
                                                   className="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-2 py-2 rounded shadow text-lg"/>
                                            <input id={"form-asal"} onChange={handleInputChange} onKeyDown={handleKeyDown} name="asal" value={inputs.asal} placeholder={"Asal Institusi"}
                                                   className="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-2 py-2 rounded shadow text-lg"/>
                                        </>
                                    )}
                                </form>
                            </div>
                            <h2 className="text-xs font-hairline text-gray-500 hover:text-black text-center">{"Made with ❤ by PMK ITS - 2020"}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

if (document.getElementById('app')) {
    ReactDOM.render(<Presensi/>, document.getElementById('app'));
}
