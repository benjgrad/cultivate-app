import * as React from 'react';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

const {
    set,
    cond,
    eq,
    spring,
    startClock,
    stopClock,
    clockRunning,
    defined,
    Value,
    Clock,
    event
} = Animated;


const runSpring = (clock: Animated.Clock, value: any, velocity: any, dest: any) => {
    const springState = {
        finished: new Value(0),
        velocity: new Value(0),
        position: new Value(0),
        time: new Value(0)
    };

    const config = {
        damping: 20,
        mass: 0.2,
        stiffness: 100,
        overshootClamping: false,
        restSpeedThreshold: 0.02,
        restDisplacementThreshold: 0.02,
        toValue: new Value(0)
    };

    return [
        cond(clockRunning(clock), 0, [
            set(springState.finished, 0),
            set(springState.velocity, velocity),
            set(springState.position, value),
            set(config.toValue, dest),
            startClock(clock)
        ]),
        spring(clock, springState, config),
        cond(springState.finished, stopClock(clock)),
        springState.position
    ];
}

type SwipeItemProps = {
    swipeLeft?: () => void;
    swipeRight?: () => void;

}

const SwipeItem: React.FC<SwipeItemProps> = (props) => {

    const dragDisplacementX = new Value(0);
    const gestureState = new Value(-1);
    const dragVelocityX = new Value(0);

    const clock = new Clock();
    const desiredTranslationX = new Value();

    //TODO This should not be running each time. Should I use 'useRef()'? 
    //or maybe just move this code ouside the functional component?
    const gestureEventHandler = event([
        {
            nativeEvent: {
                translationX: dragDisplacementX,
                velocityX: dragVelocityX,
                state: gestureState
            }
        }
    ]);

    const currTranslationX = cond(
        eq(gestureState, State.ACTIVE),
        [
            // When the guesture is active, display the dragged displacement
            stopClock(clock),
            set(desiredTranslationX, dragDisplacementX),
            desiredTranslationX
        ],
        [
            set(
                desiredTranslationX,
                cond(defined(desiredTranslationX), runSpring(clock, desiredTranslationX, dragVelocityX, 0), 0) //TODO handle swipe past threshold callback
            )
        ]
    );



    return (
        <PanGestureHandler minDeltaX={10} onGestureEvent={gestureEventHandler} onHandlerStateChange={gestureEventHandler}>
            <Animated.View
                style={[
                    {
                        transform: [{ translateX: currTranslationX }]
                    }
                ]}>
                {props.children}
            </Animated.View>
        </PanGestureHandler>);
}

export default SwipeItem;