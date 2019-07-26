import * as React from 'react';
import NavigatorMenu from './navig-component';

export class ReimbsComponent extends React.Component {
    render () {
        return (
            <div>
                <NavigatorMenu />
                Here are all the reimbursements
            </div>
        );
    }
}