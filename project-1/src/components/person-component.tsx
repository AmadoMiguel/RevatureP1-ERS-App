import React from 'react';

// Define the properties of the person component
interface IPersonProps {
    userId:string,
    firstName:string,
    lastName:string,
    username:string,
    email:string,
    role:string
}

export class PersonComponent extends React.Component<IPersonProps,any> {
    constructor(props:IPersonProps) {
        // Fill in the parent properties with child ones
        super(props);
    }

    render() {
        return (
            // Way to display information for each user
            <div className="person-box">
                <div><strong>User Id</strong>: {this.props.userId}</div>
                <div><strong>First Name</strong>: {this.props.firstName}</div>
                <div><strong>Last Name</strong>: {this.props.lastName}</div>
                <div><strong>Username</strong>: {this.props.username}</div>
                <div><strong>Email</strong>: {this.props.email}</div>
                <div><strong>Role</strong>: {this.props.role}</div>
            </div>
        );
    }
}