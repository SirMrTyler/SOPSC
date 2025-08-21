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
  const [contactPhone, setContactPhone] = useState(
    initialValues.contactPhone || ''
  );
  const [contactEmail, setContactEmail] = useState(
    initialValues.contactEmail || ''
  );
  const [addressDispatch, setAddressDispatch] = useState(
    initialValues.addressDispatch || ''
  );
  const [cityDispatch, setCityDispatch] = useState(
    initialValues.cityDispatch || ''
  );
  const [hoursOfService, setHoursOfService] = useState(
    initialValues.hoursOfService ? String(initialValues.hoursOfService) : ''
  );
  const [commuteTime, setCommuteTime] = useState(
    initialValues.commuteTime ? String(initialValues.commuteTime) : ''
  );
  const [narrative, setNarrative] = useState(initialValues.narrative || '');

  useEffect(() => {
    setDivision(initialValues.chaplainDivision || divisions[0] || '');
    setPrimaryAgency(initialValues.primaryAgency || '');
    setTypeOfService(initialValues.typeOfService || '');
    setContactName(initialValues.contactName || '');
    setContactPhone(initialValues.contactPhone || '');
    setContactEmail(initialValues.contactEmail || '');
    setAddressDispatch(initialValues.addressDispatch || '');
    setCityDispatch(initialValues.cityDispatch || '');
    setHoursOfService(
      initialValues.hoursOfService ? String(initialValues.hoursOfService) : ''
    );
    setCommuteTime(
      initialValues.commuteTime ? String(initialValues.commuteTime) : ''
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
      payload.hoursOfService = hoursOfService
        ? Number(hoursOfService)
        : undefined;
      payload.commuteTime = commuteTime ? Number(commuteTime) : undefined;
    } else {
      payload.primaryAgency = primaryAgency;
      payload.typeOfService = typeOfService;
      payload.contactName = contactName;
      payload.contactPhone = contactPhone;
      payload.contactEmail = contactEmail;
      payload.addressDispatch = addressDispatch;
      payload.cityDispatch = cityDispatch;
    }

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
              placeholder="Contact Phone"
              value={contactPhone}
              onChangeText={setContactPhone}
            />
            <TextInput
              style={styles.input}
              placeholder="Contact Email"
              value={contactEmail}
              onChangeText={setContactEmail}
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
