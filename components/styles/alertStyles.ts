import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 16,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    headerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#34C759',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 4,
    },
    headerBadgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 22,
    },
    mapContainer: {
        height: height * 0.25,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    map: {
        flex: 1,
    },
    mapLegend: {
        position: 'absolute',
        top: 16,
        right: 16,
        padding: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    legendTitle: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
    },
    legendItems: {
        gap: 6,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    legendText: {
        fontSize: 10,
    },
    alertsList: {
        flex: 1,
        paddingHorizontal: 16,
    },
    listTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    alertCard: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedAlertCard: {
        borderColor: '#007AFF',
        backgroundColor: '#f0f8ff',
    },
    alertHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    alertTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    alertTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    severityBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    severityText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    alertDescription: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 16,
    },
    alertDetails: {
        gap: 8,
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontSize: 14,
    },
    alertActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 6,
    },
    actionButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    infoSection: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        lineHeight: 20,
    },
    calloutContainer: {
        width: 200,
        padding: 8,
    },
    calloutTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    calloutDescription: {
        fontSize: 12,
        marginBottom: 8,
    },
    calloutBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    calloutBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '600',
    },
    areaMarker: {
        borderWidth: 2,
        borderColor: 'white',
    },
});

export default styles;
