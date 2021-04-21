import React from 'react'
import { PricingCard } from 'react-native-elements';

const CalorieCard = ({ id, amount, date, navigate }) => {
    return (
        <PricingCard
            color="#4f9deb"
            title={amount}
            price="kcal"
            pricingStyle={{ fontSize: 22 }}
            info={[date]}
            button={{
                title: 'UPDATE',
                onPress: () => navigate('Edit', {
                    calorieID: id,
                })
            }}
        />
    );
};

// const styles = StyleSheet.create({

// });

export default CalorieCard;