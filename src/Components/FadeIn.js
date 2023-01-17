import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import * as Waypoint from 'react-waypoint';

const FadeIn = ({ children, ...props }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <Waypoint.Waypoint onEnter={() => setIsVisible(true)}>
            <div>
                <CSSTransition
                    in={isVisible}
                    timeout={2000}
                    classNames="fade"
                    {...props}
                >
                    {children}
                </CSSTransition>
            </div>
        </Waypoint.Waypoint>
    );
};

export default FadeIn;