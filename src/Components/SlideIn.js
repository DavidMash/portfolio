import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import * as Waypoint from 'react-waypoint';

const SlideIn = ({ children, direction = 'left', ...props }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <Waypoint.Waypoint onEnter={() => setIsVisible(true)}>
            <div>
                <CSSTransition
                    in={isVisible}
                    timeout={2000}
                    classNames={`slide-${direction}`}
                    {...props}
                >
                    {children}
                </CSSTransition>
            </div>
        </Waypoint.Waypoint>
    );
};

export default SlideIn;