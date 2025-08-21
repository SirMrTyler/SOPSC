import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../hooks/useAuth';
import * as reportService from '../../services/reportService';
import { Report } from '../../types/report';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialValues?: Partial<Report>;
}

const ReportForm: React.FC<Props> = ({
  visible,
  onClose,
  onSuccess,
  initialValues = {},
}) => {
  const { user } = useAuth();
  const authUser: any = user;
  const divisions: string[] =
    authUser?.divisions ?? (authUser?.division ? [authUser.division] : []);

  const [division, setDivision] = useState(
    initialValues.chaplainDivision || divisions[0] || ''
  );
  const [primaryAgency, setPrimaryAgency] = useState(
    initialValues.primaryAgency || ''
  );
  const [typeOfService, setTypeOfService] = useState(
    initialValues.typeOfService || ''
  );
  const [contactName, setContactName] = useState(
    initialValues.contactName || ''
  );
  const [pocPhone, setPocPhone] = useState(initialValues.pocPhone || '');
  const [pocEmail, setPocEmail] = useState(initialValues.pocEmail || '');
  const [clientName, setClientName] = useState(initialValues.clientName || '');
  const [clientPhone, setClientPhone] = useState(
    initialValues.clientPhone || ''
  );
  const [addressDispatch, setAddressDispatch] = useState(
    initialValues.addressDispatch || ''
  );
  const [cityDispatch, setCityDispatch] = useState(
    initialValues.cityDispatch || ''
  );
  const [addressDestination, setAddressDestination] = useState(
    initialValues.addressDestination || ''
  );
  const [cityDestination, setCityDestination] = useState(
    initialValues.cityDestination || ''
  );
  const [hoursOfService, setHoursOfService] = useState(
    initialValues.hoursOfService ? String(initialValues.hoursOfService) : ''
  );
  const [commuteTime, setCommuteTime] = useState(
    initialValues.commuteTime ? String(initialValues.commuteTime) : ''
  );
  const [dispatchTime, setDispatchTime] = useState(
    initialValues.dispatchTime || ''
  );
  const [arrivalTime, setArrivalTime] = useState(
    initialValues.arrivalTime || ''
  );
  const [milesDriven, setMilesDriven] = useState(
    initialValues.milesDriven ? String(initialValues.milesDriven) : ''
  );
  const [narrative, setNarrative] = useState(initialValues.narrative || '');

  useEffect(() => {
    setDivision(initialValues.chaplainDivision || divisions[0] || '');
    setPrimaryAgency(initialValues.primaryAgency || '');
    setTypeOfService(initialValues.typeOfService || '');
    setContactName(initialValues.contactName || '');
    setPocPhone(initialValues.pocPhone || '');
    setPocEmail(initialValues.pocEmail || '');
    setClientName(initialValues.clientName || '');
    setClientPhone(initialValues.clientPhone || '');
    setAddressDispatch(initialValues.addressDispatch || '');
    setCityDispatch(initialValues.cityDispatch || '');
    setAddressDestination(initialValues.addressDestination || '');
    setCityDestination(initialValues.cityDestination || '');
    setHoursOfService(
      initialValues.hoursOfService ? String(initialValues.hoursOfService) : ''
    );
    setCommuteTime(
      initialValues.commuteTime ? String(initialValues.commuteTime) : ''
    );
    setDispatchTime(initialValues.dispatchTime || '');
    setArrivalTime(initialValues.arrivalTime || '');
    setMilesDriven(
      initialValues.milesDriven ? String(initialValues.milesDriven) : ''
    );
    setNarrative(initialValues.narrative || '');
  }, [initialValues, divisions]);

  const isCommunity = division === 'Community';

  const handleSubmit = async () => {
    const payload: any = {
      chaplainDivision: division,
      narrative,
    };

    if (isCommunity) {
      payload.clientName = clientName;
      payload.clientPhone = clientPhone;
      payload.hoursOfService = hoursOfService
        ? Number(hoursOfService)
        : undefined;
      payload.commuteTime = commuteTime ? Number(commuteTime) : undefined;
    } else {
      payload.primaryAgency = primaryAgency;
      payload.typeOfService = typeOfService;
      payload.contactName = contactName;
      payload.pocPhone = pocPhone;
      payload.pocEmail = pocEmail;
      payload.addressDispatch = addressDispatch;
      payload.cityDispatch = cityDispatch;
    }

    payload.addressDestination = addressDestination;
    payload.cityDestination = cityDestination;
    payload.dispatchTime = dispatchTime;
    payload.arrivalTime = arrivalTime;
    payload.milesDriven = milesDriven ? Number(milesDriven) : undefined;

    try {
      if (initialValues.reportId) {
        await reportService.update(initialValues.reportId, payload);
      } else {
        await reportService.add(payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>
          {initialValues.reportId ? 'Edit Report' : 'New Report'}
        </Text>
        {divisions.length > 1 && (
          <Picker
            selectedValue={division}
            onValueChange={(value) => setDivision(String(value))}
          >
            {divisions.map((d) => (
              <Picker.Item label={d} value={d} key={d} />
            ))}
          </Picker>
        )}
        {!isCommunity && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Primary Agency"
              value={primaryAgency}
              onChangeText={setPrimaryAgency}
            />
            <TextInput
              style={styles.input}
              placeholder="Type of Service"
              value={typeOfService}
              onChangeText={setTypeOfService}
            />
            <TextInput
              style={styles.input}
              placeholder="Contact Name"
              value={contactName}
              onChangeText={setContactName}
            />
            <TextInput
              style={styles.input}
              placeholder="POC Phone"
              value={pocPhone}
              onChangeText={setPocPhone}
            />
            <TextInput
              style={styles.input}
              placeholder="POC Email"
              value={pocEmail}
              onChangeText={setPocEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Address Dispatch"
              value={addressDispatch}
              onChangeText={setAddressDispatch}
            />
            <TextInput
              style={styles.input}
              placeholder="City Dispatch"
              value={cityDispatch}
              onChangeText={setCityDispatch}
            />
          </>
        )}
        {isCommunity && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Client Name"
              value={clientName}
              onChangeText={setClientName}
            />
            <TextInput
              style={styles.input}
              placeholder="Client Phone"
              value={clientPhone}
              onChangeText={setClientPhone}
            />
            <TextInput
              style={styles.input}
              placeholder="Hours of Service"
              value={hoursOfService}
              onChangeText={setHoursOfService}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Commute Time"
              value={commuteTime}
              onChangeText={setCommuteTime}
              keyboardType="numeric"
            />
          </>
        )}
        <TextInput
          style={styles.input}
          placeholder="Dispatch Time"
          value={dispatchTime}
          onChangeText={setDispatchTime}
        />
        <TextInput
          style={styles.input}
          placeholder="Arrival Time"
          value={arrivalTime}
          onChangeText={setArrivalTime}
        />
        <TextInput
          style={styles.input}
          placeholder="Destination Address"
          value={addressDestination}
          onChangeText={setAddressDestination}
        />
        <TextInput
          style={styles.input}
          placeholder="Destination City"
          value={cityDestination}
          onChangeText={setCityDestination}
        />
        <TextInput
          style={styles.input}
          placeholder="Miles Driven"
          value={milesDriven}
          onChangeText={setMilesDriven}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Narrative"
          value={narrative}
          onChangeText={setNarrative}
          multiline
        />
        <Button title="Submit" onPress={handleSubmit} />
        <View style={{ height: 8 }} />
        <Button title="Cancel" onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default ReportForm;
