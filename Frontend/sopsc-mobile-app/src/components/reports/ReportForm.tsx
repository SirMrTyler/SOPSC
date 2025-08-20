import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../navigation/ScreenContainer';
import * as reportService from '../../services/reportService';

const ReportForm: React.FC = () => {
  const navigation = useNavigation<any>();
  const [division, setDivision] = useState('Rogue Valley');
  const [description, setDescription] = useState('');
  const [primaryAgencyServed, setPrimaryAgencyServed] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [hoursServed, setHoursServed] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');

  const handleSubmit = async () => {
    const payload: any = {
      division,
      description,
      primaryAgencyServed,
      serviceType,
      hoursServed: parseFloat(hoursServed) || 0,
    };
    if (division === 'Community') {
      payload.clientName = clientName;
      payload.clientPhone = clientPhone;
      payload.clientAddress = clientAddress;
    }
    try {
      await reportService.addReport(payload);
      navigation.goBack();
    } catch (err) {
      console.error('[ReportForm] Failed to submit report:', err);
    }
  };

  return (
    <ScreenContainer showBack title="New Report" showBottomBar={false}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Division</Text>
        <Picker selectedValue={division} onValueChange={setDivision} style={styles.picker}>
          <Picker.Item label="Rogue Valley" value="Rogue Valley" />
          <Picker.Item label="Umpqua Valley" value="Umpqua Valley" />
          <Picker.Item label="Coastal" value="Coastal" />
          <Picker.Item label="Community" value="Community" />
        </Picker>

        {division === 'Community' ? (
          <>
            <Text style={styles.label}>Client Name</Text>
            <TextInput value={clientName} onChangeText={setClientName} style={styles.input} />
            <Text style={styles.label}>Client Phone</Text>
            <TextInput value={clientPhone} onChangeText={setClientPhone} style={styles.input} />
            <Text style={styles.label}>Client Address</Text>
            <TextInput value={clientAddress} onChangeText={setClientAddress} style={styles.input} />
          </>
        ) : (
          <>
            <Text style={styles.label}>Primary Agency Served</Text>
            <TextInput value={primaryAgencyServed} onChangeText={setPrimaryAgencyServed} style={styles.input} />
            <Text style={styles.label}>Type of Service</Text>
            <TextInput value={serviceType} onChangeText={setServiceType} style={styles.input} />
          </>
        )}

        <Text style={styles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          style={[styles.input, { height: 100 }]}
          multiline
        />

        <Text style={styles.label}>Hours Served</Text>
        <TextInput
          value={hoursServed}
          onChangeText={setHoursServed}
          style={styles.input}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: { padding: 16 },
  label: { color: 'white', marginTop: 12, marginBottom: 4 },
  input: { backgroundColor: 'white', borderRadius: 4, padding: 8 },
  picker: { backgroundColor: 'white' },
  submit: {
    marginTop: 20,
    backgroundColor: '#0a2a63',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  submitText: { color: 'white', fontWeight: 'bold' },
});

export default ReportForm;
