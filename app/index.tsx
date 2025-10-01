import React from "react";
import type {
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

// Reusable button key component 
type KeyProps = {
  label: string; // this is what to show on the button/key
  flex?: number; // optional, how wide the key should be relative to its siblings
};

function Key(props: KeyProps) {
  const label = props.label;
  // if a flex number is passed in, use that. Otherwise define it as 1.
  const flexValue = typeof props.flex === "number" ? props.flex : 1;

  function handlePress() {
    // what we do when a key is pressed
  }
  // use Android ripple effect for fun 
  const rippleConfig = { color: "#ffffff22" }; // color prop object 

  // Pressable button will call this and pass in a state obejct
  // and return a ViewStyle styleprop
  function getKeyStyle(state: PressableStateCallbackType): StyleProp<ViewStyle>{
    // start with the base style
    // this is a view style array, otherwise typescript gets confused 
    const styleList: StyleProp<ViewStyle>[] = [styles.key];

    // add the layout bits 
    styleList.push(styles.keyBox);
    styleList.push({ flex: flexValue });
    
    // if key pressed change the style
    if (state.pressed === true) {
      styleList.push(styles.keyPressed);
    }
    return styleList;
  }
  return (
    <Pressable
      onPress = {handlePress}
      android_ripple={rippleConfig}
      style = {getKeyStyle}
    >
      <Text style = {styles.keyText}> {label} </Text>
    </Pressable>
  );
}

export default function Index() {
  return (
    <View style = {styles.container}>
      <View style = {styles.row}>
        <Key label="7" />
        <Key label="8" />
        <Key label="9" />
        <Key label="x" />
      </View>
    </View>
  );
}
// create a stylesheet called styles, to reference what things will look like
const styles = StyleSheet.create<{
  container: ViewStyle;
  row: ViewStyle;
  key: ViewStyle;
  keyBox: ViewStyle;
  keyPressed: ViewStyle;
  keyText: TextStyle;
}>({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0b0b0b",
  },
  row: {
    flexDirection: "row", // lay children left to right
    width: "100%",
    marginBottom: 8,
  },
  key: { // our default key color
    backgroundColor: "#3c3b3bff",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  keyBox: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  keyPressed: { // when the key is pressed drop the opacity to give it a color change
    opacity: 0.4,
  },
  keyText: {
    color: "white",
    fontSize: 24,
    fontWeight: "600",
  },
});