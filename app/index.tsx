import React, { useState } from "react";
import type {
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

const DIGITS = new Set(["0","1","2","3","4","5","6","7","8","9"]);
const OPERATORS = new Set(["+","-","×","÷"]);

// Reusable button key component 
type KeyProps = {
  onPress?: (label: string) => void;
  label: string; // this is what to show on the button/key
  flex?: number; // optional, how wide the key should be relative to its siblings
};

function Key(props: KeyProps) {
  const label = props.label;
  // if a flex number is passed in, use that. Otherwise define it as 1.
  const flexValue = typeof props.flex === "number" ? props.flex : 1;

  function handlePress() {
    if (typeof props.onPress === "function") {
      props.onPress(label);
    }
  }
  // use Android ripple effect for fun 
  const rippleConfig = { color: "#ffffff22" }; // color prop object 

  // Pressable button will call this and pass in a state obejct
  // and return a ViewStyle styleprop
  function getKeyStyle(state: PressableStateCallbackType): StyleProp<ViewStyle>{
    // start with the base style
    // this is a view style array, otherwise typescript gets confused 
    
    let base: StyleProp<ViewStyle>;
    if (DIGITS.has(label) || label === ".") {
      base = styles.key;
    } else if (OPERATORS.has(label)) {
      base = styles.functionKey;
    } else if (label === "=") {
      base = styles.equalsKey;
    } else {
      base = styles.key;
    }

    const styleList: StyleProp<ViewStyle>[] = [base, styles.keyBox, {flex: flexValue},];
    
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
  const [display, setDisplay] = useState<string>("0");
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecond, setWaitingForSecond] = useState<boolean>(false);

  function evaluate(a: number, b: number, op: string): number{
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "×") return a * b;
    // if we're dividing by zero return NaN otherwise a/b
    if (op === "÷") return b === 0 ? NaN : a / b;
    return b;
  }

  function format(n: number): string {
    // quick sanity check 
    if (!isFinite(n) || isNaN(n)) return "Error";
    // floating point gets messy. this is doing some shenanigans to fix it
    const rounded = Math.round((n + Number.EPSILON) * 1e10) / 1e10;
    const s = String(rounded);
    // if the number is more than 12 digits display as scientific notation
    return s.length > 12 ? rounded.toExponential(6) : s;
  }
  
  // this is the big daddy, it gets the label from the button and handles everything from there 
  function handleKeyPress(label : string){
    // if the user presses AC, clear everything out and reset
    if (label === "AC") {
      setDisplay("0");
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecond(false);
      return;
    }
    // if you push a number key
    if (DIGITS.has(label)) {
      // if you just pushed a button and the display currently says error, reset everything and put that number
      if (display === "Error") {
        setDisplay(label); setFirstOperand(null); setOperator(null); setWaitingForSecond(false);
        return;
      }
      if (waitingForSecond || display === "0") {
        setDisplay(label);
        setWaitingForSecond(false);
      } else {
        setDisplay(label);
        setDisplay(display + label); // append to the current number
      }
      return;
    }

    // Decimal point
    if (label === ".") {
      if (display === "Error") {
      setDisplay("0."); setFirstOperand(null); setOperator(null); setWaitingForSecond(false);
      return;
    }
    if (waitingForSecond) {
      setDisplay("0."); setWaitingForSecond(false);
      return;
    }
    // check if the user already pressed the decimal point, then only add one if not
    if(!display.includes(".")) {
      setDisplay(display + ".");
    }
    return;
    }

    if (OPERATORS.has(label)) { 
      if (display === "Error") return; // idk just don't do anything

      const value = parseFloat(display);

      // if you push an operator, get the current value of the display, save it as a float
      if(firstOperand === null) {
        setFirstOperand(value);
        // if there's already a calculation pending with a second operand and you push 
        // an operator again, then evaluate the first calculation
      } else if (!waitingForSecond && operator !== null) {
        const result = evaluate(firstOperand, value, operator);
        setDisplay(format(result));
        // if the calculation errors return null, otherwise just use the result
        setFirstOperand(isNaN(result) ? null : result);
      }
      setOperator(label);
      setWaitingForSecond(true);
      return;
    }

    if (label === "=") { 
      if (display === "Error") return;
      // check all the conditions to see if we're ready to calculate
      if (operator !== null && firstOperand !== null && !waitingForSecond) {
        const second = parseFloat(display);
        const result = evaluate(firstOperand, second, operator);
        setDisplay(format(result));
        // if the calculation didn't error, set the new result to the first operand
        setFirstOperand(isNaN(result) ? null : result);
        setOperator(null);
        setWaitingForSecond(true);
      }
      return;
    }
  }

  return (
    <View style = {styles.container}>
      <View style={styles.display}>
        <Text style = {styles.displayText} numberOfLines = {1} adjustsFontSizeToFit>
          {display}
        </Text>
      </View>
      <View style = {styles.pad}>
        <View style = {styles.row}>
          <Key label="7" onPress={handleKeyPress}/>
          <Key label="8" onPress={handleKeyPress}/>
          <Key label="9" onPress={handleKeyPress}/>
          <Key label="÷" onPress={handleKeyPress}/>
        </View>
        <View style = {styles.row}>
          <Key label="4" onPress={handleKeyPress}/>
          <Key label="5" onPress={handleKeyPress}/>
          <Key label="6" onPress={handleKeyPress}/>
          <Key label="×" onPress={handleKeyPress}/>
        </View>
        <View style = {styles.row}>
          <Key label="1" onPress={handleKeyPress}/>
          <Key label="2" onPress={handleKeyPress}/>
          <Key label="3" onPress={handleKeyPress}/>
          <Key label="-" onPress={handleKeyPress}/>
        </View>
        <View style={styles.row}>
          <Key label="0" flex={3.1} onPress={handleKeyPress}/> 
          <Key label="." onPress={handleKeyPress}/>
          <Key label="+" onPress={handleKeyPress}/>
        </View>
        <View style={styles.row}>
          <Key label="AC" flex={1} onPress={handleKeyPress}/> 
          <Key label="=" onPress={handleKeyPress}/>
        </View>
      </View>
    </View>
  );
}
// create a stylesheet called styles, to reference what things will look like
const styles = StyleSheet.create<{
  container: ViewStyle;
  display: ViewStyle;
  pad: ViewStyle;
  displayText: TextStyle;
  row: ViewStyle;
  key: ViewStyle;
  keyBox: ViewStyle;
  keyPressed: ViewStyle;
  keyText: TextStyle;
  functionKey: ViewStyle;
  equalsKey: ViewStyle;
}>({
  display: {
    minHeight: 96,
    padding: 16,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  displayText: {
    color: "white",
    fontSize: 56,
    fontWeight: "200",
  },
  pad: {
    width: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "stretch",
    backgroundColor: "#0b0b0b",
    paddingHorizontal: 12,
    paddingBottom: 70,
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
  functionKey: {
    backgroundColor: "#2066c3ff",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  equalsKey: {
    backgroundColor: "#81b8ffff",
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