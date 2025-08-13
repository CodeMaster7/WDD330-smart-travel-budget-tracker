// Purpose: Create and list trips.

import { getTrips, setTrips } from './dataStorage.mjs';

export function createTrip({
    id,
    name,
    countryCode,
    startDate,
    endDate,
    totalBudget,
}) {
    // check required fields exist
    if (
        !id ||
        !name ||
        !countryCode ||
        !startDate ||
        !endDate ||
        totalBudget == null
    ) {
        throw new Error('createTrip: missing required fields');
    }

    const newTrip = {
        id,
        name,
        countryCode,
        startDate,
        endDate,
        totalBudget: Number(totalBudget),
        spentHome: 0,
    };

    const trips = getTrips();
    trips.push(newTrip);
    setTrips(trips);
    return newTrip;
}

export function listTrips() {
    return getTrips();
}
