import React, { useState, useRef } from 'react';
import { Transition } from 'react-transition-group';
import * as Waypoint from 'react-waypoint';

const FadeIn = ({ children, ...props }) => {
    const [isVisible, setIsVisible] = useState(false);
    const nodeRef = useRef(null);

    const duration = 500;
    
    const defaultStyle = {
      transition: `opacity ${duration}ms ease-in-out`,
        opacity: 0
    }

    const transitionStyles = {
      entering: { opacity: 1 },
      entered:  { opacity: 1 },
      exiting:  { opacity: 0 },
      exited:  { opacity: 0 },
    };

    return (
        <Waypoint.Waypoint onEnter={() => setIsVisible(true)}>
            <div>
                <Transition
                    nodeRef={nodeRef}
                    in={isVisible}
                    timeout={duration}
                    classNames="fade"
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

export default FadeIn;