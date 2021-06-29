import * as React from 'react';
import { StyleSheet } from 'react-native';
import MainLayout from '../components/MainLayout';

import { Text, View } from '../components/Themed';
import SwipeItem from '../components/common/SwipeItem';

export default function AnnualScreen() {

  // var content = [];
  // for (let i = 0; i < 10; i++) {
  //   content.push(<SwipeItem key={i} />)
  // }
  return (
    <MainLayout title="Annuals" >
      {/* {content} */}
    </MainLayout >
  );
}



const styles = StyleSheet.create({

  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
