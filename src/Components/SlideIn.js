import React, { useState, useRef } from 'react';
import { Transition } from 'react-transition-group';
import * as Waypoint from 'react-waypoint';

const SlideIn = ({ children, direction = 'left', ...props }) => {
    const [isVisible, setIsVisible] = useState(false);
    const nodeRef = useRef(null);

    const duration = 500;
    
    const defaultStyle = {
      transition: `opacity ${duration}ms ease-in-out`,
        opacity: 0
    }

    const transitionStyles = {
        entering:
            {
                opacity: 1,
                position: "relative",
                left: 0,
                transition: "left 1000ms"
            },
        entered:
            {
                opacity: 1,
                position: "relative",
                left: 0,
                transition: "left 1000ms"
            },
        exiting:
            {
                opacity: 0,
                position: "absolute",
                left: "-100%"
            },
        exited:
            {
                opacity: 0,
                position: "absolute",
                left: "-100%"
            },
    };

    return (
        <Waypoint.Waypoint onEnter={() => setIsVisible(true)}>
            <div>
                <Transition
                    nodeRef={nodeRef}
                    in={isVisible}
                    timeout={duration}
                    classNames={`slide-${direction}`}
                    {...props}
                >
                    {state => (
                        <div ref={nodeRef} style={{
                            ...defaultStyle,
                            ...transitionStyles[state]}}>
                            {children}
                        </div>
                    )}
                </Transition>
            </div>
        </Waypoint.Waypoint>
    );
};

export default SlideIn;