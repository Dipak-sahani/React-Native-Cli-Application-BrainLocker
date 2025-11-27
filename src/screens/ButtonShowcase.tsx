import React from 'react';
import { View, Text, ScrollView, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Button from '../components/Button/Button';
import { PlusIcon, CheckIcon, ArrowRightIcon, SaveIcon, DeleteIcon } from '../components/Icons';

const ButtonShowcase: React.FC = () => {
  const customButtonStyle: ViewStyle = {
    backgroundColor: '#8B5CF6',
    borderRadius: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  };

  const customTextStyle: TextStyle = {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Beautiful Buttons</Text>
      
      {/* Variants Section */}
      <Text style={styles.sectionTitle}>Variants</Text>
      <View style={styles.group}>
        <Button title="Primary Button" variant="primary" onPress={() => {}} style={styles.buttonSpacing} />
        <Button title="Secondary" variant="secondary" onPress={() => {}} style={styles.buttonSpacing} />
        <Button title="Success" variant="success" onPress={() => {}} style={styles.buttonSpacing} />
        <Button title="Warning" variant="warning" onPress={() => {}} style={styles.buttonSpacing} />
        <Button title="Error" variant="error" onPress={() => {}} style={styles.buttonSpacing} />
        <Button title="Outline" variant="outline" onPress={() => {}} style={styles.buttonSpacing} />
        <Button title="Ghost" variant="ghost" onPress={() => {}} style={styles.buttonSpacing} />
      </View>

      {/* Sizes Section */}
      <Text style={styles.sectionTitle}>Sizes</Text>
      <View style={styles.group}>
        <Button title="Small" size="small" variant="primary" onPress={() => {}} style={styles.buttonSpacing} />
        <Button title="Medium" size="medium" variant="primary" onPress={() => {}} style={styles.buttonSpacing} />
        <Button title="Large" size="large" variant="primary" onPress={() => {}} style={styles.buttonSpacing} />
      </View>

      {/* With Icons */}
      <Text style={styles.sectionTitle}>With Icons</Text>
      <View style={styles.group}>
        <Button 
          title="Add New" 
          variant="success" 
          leftIcon={<PlusIcon />}
          onPress={() => {}}
          style={styles.buttonSpacing}
        />
        <Button 
          title="Save Changes" 
          variant="primary" 
          leftIcon={<SaveIcon />}
          onPress={() => {}}
          style={styles.buttonSpacing}
        />
        <Button 
          title="Continue" 
          variant="outline" 
          rightIcon={<ArrowRightIcon color="#6366F1" />}
          onPress={() => {}}
          style={styles.buttonSpacing}
        />
        <Button 
          title="Delete" 
          variant="error" 
          leftIcon={<DeleteIcon />}
          onPress={() => {}}
          style={styles.buttonSpacing}
        />
      </View>

      {/* States */}
      <Text style={styles.sectionTitle}>States</Text>
      <View style={styles.group}>
        <Button title="Loading" variant="primary" loading onPress={() => {}} style={styles.buttonSpacing} />
        <Button title="Disabled" variant="primary" disabled onPress={() => {}} style={styles.buttonSpacing} />
        <Button 
          title="Custom Style" 
          variant="secondary" 
          onPress={() => {}}
         
          textStyle={customTextStyle}
        />
      </View>

      {/* Full Width */}
      <Text style={styles.sectionTitle}>Full Width</Text>
      <View style={styles.group}>
        <Button 
          title="Full Width Button" 
          variant="primary" 
          fullWidth 
          onPress={() => {}}
          style={styles.buttonSpacing}
        />
        <Button 
          title="Full Width Outline" 
          variant="outline" 
          fullWidth 
          onPress={() => {}}
          style={styles.buttonSpacing}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1f2937',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 24,
    color: '#374151',
  },
  group: {
    marginBottom: 8,
  },
  buttonSpacing: {
    marginBottom: 12,
  },
});

export default ButtonShowcase;