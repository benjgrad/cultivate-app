import * as React from 'react';

import { NativeScrollEvent, NativeSyntheticEvent, View, VirtualizedList, StyleSheet } from "react-native"

type ScrollWheelProps = {
    onScroll: (value: number) => void
}


export const ScrollWheel: React.FC<ScrollWheelProps> = (props) => {
    let placeholderData: number[] = [];

    const initialScrollIndex = 50;
    const initialXVal = initialScrollIndex * 200;
    const [oldValue, setOldValue] = React.useState(0);
    const [oldTimestamp, setOldTimestamp] = React.useState(0);
    const [velocity, setVelocity] = React.useState(0);
    const [jumped, setJumped] = React.useState(false);
    const decelerationRate = 1;
    const scrollThreshold = 10;

    for (let i = 0; i < 100; i++) {
        placeholderData[i] = i;
    }
    let flatListRef: VirtualizedList<number> | null;
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (jumped) {
            console.log("Jump to middle", velocity);
            //const velocityIndex = initialScrollIndex + (newIndex % 1) + velocity * 3 * decelerationRate;

            //Continue current velocity
            flatListRef?.scrollToOffset({
                animated: true,
                offset: initialXVal + 10 * velocity * decelerationRate
            });
            setJumped(false);
        }

        const distance = (event.nativeEvent.contentOffset.x - initialXVal) - oldValue;
        const elapsed = event.timeStamp - oldTimestamp;

        const newIndex = event.nativeEvent.contentOffset.x / 200;

        setOldValue(event.nativeEvent.contentOffset.x - initialXVal);
        setOldTimestamp(event.timeStamp);
        props.onScroll(event.nativeEvent.contentOffset.x - initialXVal);
        if (flatListRef && (//Math.abs(velocity) < 0.03 ||
            (newIndex < scrollThreshold ||
                initialScrollIndex * 2 - newIndex < scrollThreshold))) {
            //Snap to the center, with current offset
            flatListRef.scrollToOffset({
                animated: false,
                offset: initialXVal + (event.nativeEvent.contentOffset.x % 200)
            });
            setJumped(true);
            setVelocity(distance / elapsed);
        }
        console.log(velocity);

    }


    return (<View
        style={styles.scrollWheel}>
        <VirtualizedList
            data={placeholderData}
            getItemCount={(data) => initialScrollIndex * 2}
            getItem={(data, index) => data[index % data.length]}
            getItemLayout={(data, index) => { return { length: 20, offset: 200 * index, index }; }}
            keyExtractor={(item: number) => item.toString()}
            horizontal
            ref={(ref) => { flatListRef = ref; }}
            //showsHorizontalScrollIndicator={false}
            decelerationRate={decelerationRate}
            onScroll={handleScroll}
            maxToRenderPerBatch={100}
            renderItem={() => {
                return <ScrollItem />
            }}
            initialScrollIndex={initialScrollIndex}
        />
    </View>);
}

const ScrollItem = React.memo(() => {
    return (<>
        <View style={styles.scrollWheelItem} />
        <View style={styles.scrollWheelItem} />
        <View style={styles.scrollWheelItem} />
        <View style={styles.scrollWheelItem} />
        <View style={styles.scrollWheelItem} />
        <View style={styles.scrollWheelItem} />
        <View style={styles.scrollWheelItem} />
        <View style={styles.scrollWheelItem} />
        <View style={styles.scrollWheelItem} />
        <View style={styles.scrollWheelItem} />
    </>);
}, () => true);

const styles = StyleSheet.create({
    scrollWheel: {
        height: 40,
    },
    scrollWheelItem: {
        height: 40,
        backgroundColor: 'grey',
        borderColor: 'black',
        borderRadius: 2,
        width: 20,
        borderWidth: 1
    }
});