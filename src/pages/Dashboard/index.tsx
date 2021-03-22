import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiClock, FiPower } from 'react-icons/fi';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { isToday, format, parseISO, isAfter } from 'date-fns';

import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import {
    Container,
    Header,
    HeaderContent,
    Profile,
    Content,
    Schedule,
    NextAppointment,
    Section,
    Appointment,
    Calendar,
} from './styles';

interface MonthAvailabilityItem {
    day: number;
    isAvailable: boolean;
}

interface Appointment {
    id: string;
    date: string;
    formattedHour: string;
    customer: {
        name: string;
        avatar_url: string;
    };
}

const Dashboard: React.FC = () => {
    const { signOut, user } = useAuth();

    const today = new Date();
    const nextWorkDay =
        today.getDay() > 1
            ? today
            : new Date(today.setDate(today.getDate() + 1));
    const [selectedDate, setSelectedDate] = useState(nextWorkDay);
    const [selectedMonth, setSelectedMonth] = useState(nextWorkDay);

    const [monthAvailability, setMonthAvailability] = useState<
        MonthAvailabilityItem[]
    >([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const handleDateChange = useCallback(
        (day: Date, modifiers: DayModifiers) => {
            if (modifiers.available && !modifiers.disabled) {
                setSelectedDate(day);
            }
        },
        [],
    );

    const handleMonthChange = useCallback((month: Date) => {
        setSelectedMonth(month);
    }, []);

    useEffect(() => {
        api.get(`/providers/${user.id}/month-availability`, {
            params: {
                year: selectedMonth.getFullYear(),
                month: selectedMonth.getMonth() + 1,
            },
        }).then(res => {
            setMonthAvailability(res.data);
        });
    }, [selectedMonth, user]);

    useEffect(() => {
        api.get<Appointment[]>('/appointments/me', {
            params: {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate(),
            },
        }).then(res => {
            const formattedAppointmets = res.data.map(appointment => ({
                ...appointment,
                formattedHour: format(parseISO(appointment.date), 'HH:mm'),
            }));
            setAppointments(formattedAppointmets);
        });
    }, [selectedDate]);

    const disabledDays = useMemo(
        () =>
            monthAvailability
                .filter(date => !date.isAvailable)
                .map(
                    date =>
                        new Date(
                            selectedMonth.getFullYear(),
                            selectedMonth.getMonth(),
                            date.day,
                        ),
                ),
        [monthAvailability, selectedMonth],
    );

    const selectedDateAsText = useMemo(
        () => ({
            isToday: isToday(selectedDate),
            dayOfMonth: format(selectedDate, "do' of 'MMMM"),
            dayOfWeek: format(selectedDate, 'EEEE'),
        }),
        [selectedDate],
    );

    const morningAppointments = useMemo(
        () =>
            appointments.filter(
                appointment => parseISO(appointment.date).getHours() <= 12,
            ),
        [appointments],
    );
    const afternoonAppointments = useMemo(
        () =>
            appointments.filter(
                appointment => parseISO(appointment.date).getHours() > 12,
            ),
        [appointments],
    );
    const nextAppointment = useMemo(
        () =>
            appointments.find(appointment =>
                isAfter(parseISO(appointment.date), new Date()),
            ),
        [appointments],
    );

    return (
        <Container>
            <Header>
                <HeaderContent>
                    <img src={logoImg} alt="GoBarber" />

                    <Profile>
                        <img src={user.avatar_url} alt={user.name} />
                        <div>
                            <span>Welcome,</span>
                            <Link to="/profile">
                                <strong>{user.name}</strong>
                            </Link>
                        </div>
                    </Profile>

                    <button type="button" onClick={signOut}>
                        <FiPower />
                    </button>
                </HeaderContent>
            </Header>

            <Content>
                <Schedule>
                    <h1>Scheduled appointments</h1>
                    <p>
                        {selectedDateAsText.isToday && <span>Today</span>}
                        <span>{selectedDateAsText.dayOfMonth}</span>
                        <span>{selectedDateAsText.dayOfWeek}</span>
                    </p>

                    {selectedDateAsText.isToday && nextAppointment && (
                        <NextAppointment>
                            <strong>Next appointment</strong>
                            <div>
                                <img
                                    src={nextAppointment.customer.avatar_url}
                                    alt={nextAppointment.customer.name}
                                />
                                <strong>{nextAppointment.customer.name}</strong>
                                <span>
                                    <FiClock />
                                    {nextAppointment.formattedHour}
                                </span>
                            </div>
                        </NextAppointment>
                    )}

                    <Section>
                        <strong>Morning</strong>

                        {morningAppointments.length === 0 && (
                            <p>No appointments scheduled for this time</p>
                        )}

                        {morningAppointments.map(appointment => (
                            <Appointment key={appointment.id}>
                                <span>
                                    <FiClock />
                                    {appointment.formattedHour}
                                </span>

                                <div>
                                    <img
                                        src={appointment.customer.avatar_url}
                                        alt={appointment.customer.name}
                                    />
                                    <strong>{appointment.customer.name}</strong>
                                </div>
                            </Appointment>
                        ))}
                    </Section>

                    <Section>
                        <strong>Afternoon</strong>

                        {afternoonAppointments.length === 0 && (
                            <p>No appointments scheduled for this time</p>
                        )}

                        {afternoonAppointments.map(appointment => (
                            <Appointment key={appointment.id}>
                                <span>
                                    <FiClock />
                                    {appointment.formattedHour}
                                </span>

                                <div>
                                    <img
                                        src={appointment.customer.avatar_url}
                                        alt={appointment.customer.name}
                                    />
                                    <strong>{appointment.customer.name}</strong>
                                </div>
                            </Appointment>
                        ))}
                    </Section>
                </Schedule>
                <Calendar>
                    <DayPicker
                        fromMonth={new Date()}
                        disabledDays={[{ daysOfWeek: [0, 1] }, ...disabledDays]}
                        modifiers={{
                            available: { daysOfWeek: [1, 2, 3, 4, 5, 6] },
                        }}
                        firstDayOfWeek={1}
                        selectedDays={selectedDate}
                        onDayClick={handleDateChange}
                        onMonthChange={handleMonthChange}
                    />
                </Calendar>
            </Content>
        </Container>
    );
};

export default Dashboard;
