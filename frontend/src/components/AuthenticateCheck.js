import React from 'react';
import Login from './Login';

export default (Component) => {
    console.log(localStorage.getItem('token'))
    return (props) => (
        localStorage.getItem('token') ? (
            <div>
                <Component {...props} />
            </div >)
            : (
                <div>
                    <Login {...props} />
                </div >)

    );
}

// if (!localStorage.getItem('token')) {
//         console.log('No token')
//         return (props) => (
//             <div>
//                 <Login {...props} />
//             </div>
//         );
// } else {
//     return (props) => (
//         <div>
//             <Component {...props} />
//         </div>

//     );
// }
{/* } */ }