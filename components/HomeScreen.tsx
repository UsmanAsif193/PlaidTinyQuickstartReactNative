import {link} from 'fs';
import React, {useState, useEffect, useCallback} from 'react';
import {Platform, View, Text, StyleSheet, Pressable} from 'react-native';
import {
  PlaidLink,
  LinkExit,
  LinkSuccess,
  openLink,
} from 'react-native-plaid-link-sdk';

var styles = require('./style');

const HomeScreen = ({navigation}: any) => {
  const [linkToken, setLinkToken] = useState(null);
  const address = Platform.OS === 'ios' ? 'localhost' : '10.0.2.2';
  const createLinkToken = useCallback(async () => {
    await fetch(`http://${address}:8080/api/create_link_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({address: address}),
    })
      .then(response => response.json())
      .then(data => {
        setLinkToken(data.link_token);
      })
      .catch(err => {
        console.log(err);
      });
  }, [setLinkToken]);

  useEffect(() => {
    if (linkToken == null) {
      createLinkToken();
    }
  }, [linkToken]);

  const openPlaidLink = () => {
    console.log("hello")
    openLink({
      tokenConfig: {
        token: linkToken,
        noLoadingState: false,
      },
      onSuccess: async (success: LinkSuccess) => {
        await fetch(`http://${address}:8080/api/exchange_public_token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({public_token: success.publicToken}),
        }).catch(err => {
          console.log(err);
        });
        navigation.navigate('Success', success);
      },
      onExit: (response: LinkExit) => {
        console.log(response);
      },
      onPress: () => console.log('hello'),
    });
  };

  console.log('link', linkToken);
  return (
    <View style={{flex: 1}}>
      <View style={styles.heading}>
        <Text style={styles.titleText}>Tiny Quickstart – React Native</Text>
      </View>
      <View style={styles.bottom}>
        <Pressable onPress={openPlaidLink}>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Open Link plaid</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default HomeScreen;
