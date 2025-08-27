import { View, Text} from 'react-native';
import ScreenContainer from '../Navigation/ScreenContainer';

const AdminDashboard = () => {
    return (
        <ScreenContainer>
            <View style={{ flex:1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white' }}>Admin Dashboard</Text>
            </View>
        </ScreenContainer>
    );
};

export default AdminDashboard;
