import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../hooks/useAuth';
import * as reportService from './services/reportService';
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
  initialValues,
}) => {
  const { user } = useAuth();
  const authUser: any = user;
  const divisions = useMemo<string[]>(() => {
    const { divisions: userDivisions, division: singleDivision } =
      authUser ?? {};

    if (userDivisions) {
      return userDivisions;
    }

    return singleDivision ? [singleDivision] : [];
  }, [authUser]);

  const [division, setDivision] = useState(
    initialValues?.chaplainDivision || divisions[0] || ''
  );
  const [primaryAgency, setPrimaryAgency] = useState(
    initialValues?.primaryAgency || ''
  );
  const [typeOfService, setTypeOfService] = useState(
    initialValues?.typeOfService || ''
  );
  const [contactName, setContactName] = useState(
    initialValues?.contactName || ''
  );
  const [pocPhone, setPocPhone] = useState(initialValues?.pocPhone || '');
  const [pocEmail, setPocEmail] = useState(initialValues?.pocEmail || '');
  const [clientName, setClientName] = useState(initialValues?.clientName || '');
  const [clientPhone, setClientPhone] = useState(
    initialValues?.clientPhone || ''
  );
  const [addressDispatch, setAddressDispatch] = useState(
    initialValues?.addressDispatch || ''
  );
  const [cityDispatch, setCityDispatch] = useState(
    initialValues?.cityDispatch || ''
  );
  const [addressDestination, setAddressDestination] = useState(
    initialValues?.addressDestination || ''
  );
  const [cityDestination, setCityDestination] = useState(
    initialValues?.cityDestination || ''
  );
  const [hoursOfService, setHoursOfService] = useState(
    initialValues?.hoursOfService ? String(initialValues.hoursOfService) : ''
  );
  const [commuteTime, setCommuteTime] = useState(
    initialValues?.commuteTime ? String(initialValues.commuteTime) : ''
  );
  const [dispatchTime, setDispatchTime] = useState(
    initialValues?.dispatchTime || ''
  );
  const [arrivalTime, setArrivalTime] = useState(
    initialValues?.arrivalTime || ''
  );
  const [milesDriven, setMilesDriven] = useState(
    initialValues?.milesDriven ? String(initialValues.milesDriven) : ''
  );
  const [narrative, setNarrative] = useState(initialValues?.narrative || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setDivision(initialValues?.chaplainDivision || divisions[0] || '');
    setPrimaryAgency(initialValues?.primaryAgency || '');
    setTypeOfService(initialValues?.typeOfService || '');
    setContactName(initialValues?.contactName || '');
    setPocPhone(initialValues?.pocPhone || '');
    setPocEmail(initialValues?.pocEmail || '');
    setClientName(initialValues?.clientName || '');
    setClientPhone(initialValues?.clientPhone || '');
    setAddressDispatch(initialValues?.addressDispatch || '');
    setCityDispatch(initialValues?.cityDispatch || '');
    setAddressDestination(initialValues?.addressDestination || '');
    setCityDestination(initialValues?.cityDestination || '');
    setHoursOfService(
      initialValues?.hoursOfService ? String(initialValues.hoursOfService) : ''
    );
    setCommuteTime(
      initialValues?.commuteTime ? String(initialValues.commuteTime) : ''
    );
    setDispatchTime(initialValues?.dispatchTime || '');
    setArrivalTime(initialValues?.arrivalTime || '');
    setMilesDriven(
      initialValues?.milesDriven ? String(initialValues.milesDriven) : ''
    );
    setNarrative(initialValues?.narrative || '');
  }, [initialValues, visible, divisions]);

  const isCommunity = division === 'Community';

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    if (!narrative.trim()) {
      newErrors.narrative = 'Narrative is required';
    }

    if (!dispatchTime.trim()) {
      newErrors.dispatchTime = 'Dispatch time is required';
    }

    if (!arrivalTime.trim()) {
      newErrors.arrivalTime = 'Arrival time is required';
    }

    if (!addressDestination.trim()) {
      newErrors.addressDestination = 'Destination address is required';
    }

    if (!cityDestination.trim()) {
      newErrors.cityDestination = 'Destination city is required';
    }

    if (!milesDriven.trim()) {
      newErrors.milesDriven = 'Miles driven is required';
    } else if (isNaN(Number(milesDriven))) {
      newErrors.milesDriven = 'Miles driven must be a number';
    }

    if (isCommunity) {
      if (!clientName.trim()) {
        newErrors.clientName = 'Client name is required';
      }
      if (!clientPhone.trim()) {
        newErrors.clientPhone = 'Client phone is required';
      }
      if (!hoursOfService.trim()) {
        newErrors.hoursOfService = 'Hours of service is required';
      } else if (isNaN(Number(hoursOfService))) {
        newErrors.hoursOfService = 'Hours of service must be a number';
      }
      if (!commuteTime.trim()) {
        newErrors.commuteTime = 'Commute time is required';
      } else if (isNaN(Number(commuteTime))) {
        newErrors.commuteTime = 'Commute time must be a number';
      }
    } else {
      if (!primaryAgency.trim()) {
        newErrors.primaryAgency = 'Primary agency is required';
      }
      if (!typeOfService.trim()) {
        newErrors.typeOfService = 'Type of service is required';
      }
      if (!contactName.trim()) {
        newErrors.contactName = 'Contact name is required';
      }
      if (!pocPhone.trim()) {
        newErrors.pocPhone = 'POC phone is required';
      }
      if (!pocEmail.trim()) {
        newErrors.pocEmail = 'POC email is required';
      }
      if (!addressDispatch.trim()) {
        newErrors.addressDispatch = 'Dispatch address is required';
      }
      if (!cityDispatch.trim()) {
        newErrors.cityDispatch = 'Dispatch city is required';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const payload: any = {
      chaplainDivision: division,
      narrative,
    };

    if (isCommunity) {
      payload.clientName = clientName;
      payload.clientPhone = clientPhone;
      payload.hoursOfService = Number(hoursOfService);
      payload.commuteTime = Number(commuteTime);
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
    payload.milesDriven = Number(milesDriven);

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
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          {initialValues.reportId ? 'Edit Report' : 'New Report'}
        </Text>
        {divisions.length > 1 && (
          <>
            <Text style={styles.label}>Division</Text>
            <Picker
              selectedValue={division}
              onValueChange={(value) => setDivision(String(value))}
            >
              {divisions.map((d) => (
                <Picker.Item label={d} value={d} key={d} />
              ))}
            </Picker>
          </>
        )}
        {!isCommunity && (
          <>
            <Text style={styles.sectionHeader}>Agency Information</Text>
            <Text style={styles.label}>Primary Agency</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter primary agency"
              value={primaryAgency}
              onChangeText={setPrimaryAgency}
            />
            {errors.primaryAgency && (
              <Text style={styles.errorText}>{errors.primaryAgency}</Text>
            )}
            <Text style={styles.label}>Type of Service</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter type of service"
              value={typeOfService}
              onChangeText={setTypeOfService}
            />
            {errors.typeOfService && (
              <Text style={styles.errorText}>{errors.typeOfService}</Text>
            )}
            <Text style={styles.label}>Contact Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter contact name"
              value={contactName}
              onChangeText={setContactName}
            />
            {errors.contactName && (
              <Text style={styles.errorText}>{errors.contactName}</Text>
            )}
            <Text style={styles.label}>POC Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter POC phone"
              value={pocPhone}
              onChangeText={setPocPhone}
            />
            {errors.pocPhone && (
              <Text style={styles.errorText}>{errors.pocPhone}</Text>
            )}
            <Text style={styles.label}>POC Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter POC email"
              value={pocEmail}
              onChangeText={setPocEmail}
            />
            {errors.pocEmail && (
              <Text style={styles.errorText}>{errors.pocEmail}</Text>
            )}
            <Text style={styles.label}>Dispatch Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter dispatch address"
              value={addressDispatch}
              onChangeText={setAddressDispatch}
            />
            {errors.addressDispatch && (
              <Text style={styles.errorText}>{errors.addressDispatch}</Text>
            )}
            <Text style={styles.label}>Dispatch City</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter dispatch city"
              value={cityDispatch}
              onChangeText={setCityDispatch}
            />
            {errors.cityDispatch && (
              <Text style={styles.errorText}>{errors.cityDispatch}</Text>
            )}
          </>
        )}
        {isCommunity && (
          <>
            <Text style={styles.sectionHeader}>Client Information</Text>
            <Text style={styles.label}>Client Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter client name"
              value={clientName}
              onChangeText={setClientName}
            />
            {errors.clientName && (
              <Text style={styles.errorText}>{errors.clientName}</Text>
            )}
            <Text style={styles.label}>Client Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter client phone"
              value={clientPhone}
              onChangeText={setClientPhone}
            />
            {errors.clientPhone && (
              <Text style={styles.errorText}>{errors.clientPhone}</Text>
            )}
            <Text style={styles.label}>Hours of Service</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter hours of service"
              value={hoursOfService}
              onChangeText={setHoursOfService}
              keyboardType="numeric"
            />
            {errors.hoursOfService && (
              <Text style={styles.errorText}>{errors.hoursOfService}</Text>
            )}
            <Text style={styles.label}>Commute Time</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter commute time"
              value={commuteTime}
              onChangeText={setCommuteTime}
              keyboardType="numeric"
            />
            {errors.commuteTime && (
              <Text style={styles.errorText}>{errors.commuteTime}</Text>
            )}
          </>
        )}

        <Text style={styles.sectionHeader}>Dispatch Details</Text>
        <Text style={styles.label}>Dispatch Time</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter dispatch time"
          value={dispatchTime}
          onChangeText={setDispatchTime}
        />
        {errors.dispatchTime && (
          <Text style={styles.errorText}>{errors.dispatchTime}</Text>
        )}
        <Text style={styles.label}>Arrival Time</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter arrival time"
          value={arrivalTime}
          onChangeText={setArrivalTime}
        />
        {errors.arrivalTime && (
          <Text style={styles.errorText}>{errors.arrivalTime}</Text>
        )}
        <Text style={styles.label}>Destination Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter destination address"
          value={addressDestination}
          onChangeText={setAddressDestination}
        />
        {errors.addressDestination && (
          <Text style={styles.errorText}>{errors.addressDestination}</Text>
        )}
        <Text style={styles.label}>Destination City</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter destination city"
          value={cityDestination}
          onChangeText={setCityDestination}
        />
        {errors.cityDestination && (
          <Text style={styles.errorText}>{errors.cityDestination}</Text>
        )}
        <Text style={styles.label}>Miles Driven</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter miles driven"
          value={milesDriven}
          onChangeText={setMilesDriven}
          keyboardType="numeric"
        />
        {errors.milesDriven && (
          <Text style={styles.errorText}>{errors.milesDriven}</Text>
        )}

        <Text style={styles.sectionHeader}>Narrative</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter narrative"
          value={narrative}
          onChangeText={setNarrative}
          multiline
        />
        {errors.narrative && (
          <Text style={styles.errorText}>{errors.narrative}</Text>
        )}
        <Button title="Submit" onPress={handleSubmit} />
        <View style={{ height: 8 }} />
        <Button title="Cancel" onPress={onClose} />
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    color: '#000',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#000',
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    color: '#000',
    backgroundColor: 'white',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
});

export default ReportForm;