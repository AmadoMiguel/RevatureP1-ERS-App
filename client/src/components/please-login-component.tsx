import * as React from 'react';
import { Link } from 'react-router-dom';

export class PleaseLoginComponent extends React.Component <any,any> {

    render() {
        return (
            <div>
                <br/>
                <h3>Please, login first</h3>
                <br/>
                <Link to="/login" >Go to login page</Link>
            </div>
        );
    }
}