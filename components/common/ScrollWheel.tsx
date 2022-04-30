import * as React from 'react';

import { NativeScrollEvent, NativeSyntheticEvent, View, VirtualizedList, StyleSheet } from "react-native"

type ScrollWheelProps = {
    onScroll: (value: number) => void
}


export const ScrollWheel: React.FC<ScrollWheelProps> = (props) => {
    let placeholderData: number[] = [];

    const initialScrollIndex = 100;
    const initialXVal = initialScrollIndex * 200;
    const [oldValue, setOldValue] = React.useState(0);
    const [oldTimestamp, setOldTimestamp] = React.useState(0);
    const decelerationRate = 0;

    for (let i = 0; i < 100; i++) {
        placeholderData[i] = i;
    }
    let flatListRef: VirtualizedList<number> | null;
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const distance = oldValue - (event.nativeEvent.contentOffset.x - initialXVal);
        const elapsed = event.timeStamp - oldTimestamp;
        const velocity = distance / elapsed;

        const newIndex = event.nativeEvent.contentOffset.x / 200;

        setOldValue(event.nativeEvent.contentOffset.x - initialXVal);
        setOldTimestamp(event.timeStamp);
        props.onScroll(event.nativeEvent.contentOffset.x - initialXVal);
        if (Math.abs(velocity) < 0.04 && flatListRef) {
            flatListRef.scrollToIndex({
                animated: false,
                index: initialScrollIndex + newIndex % 1
            });
        }
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