import { useDispatch, useSelector } from "react-redux"
import { calendarApi } from "../api";
import { convertEventsToDateEvents } from "../helpers";
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent, onDeactivateEvent } from "../store";


export const useCalendarStore = () => {

    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector( state => state.calendar);
    const { user } = useSelector( state => state.auth );
    
    const setActiveEvent = ( calendarEvent ) => {
        dispatch( onSetActiveEvent( calendarEvent ) );
    };

    const startSavingEvent = async( calendarEvent ) => {
        //TODO: llegar al backend
        //Todo Update Event
        if( calendarEvent._id ) {
            //* Actualizando
            dispatch( onUpdateEvent({ ...calendarEvent }) );
        } else {
            //* creando
            const { data } = await calendarApi.post( '/events', calendarEvent );
            console.log(data)
            dispatch( onAddNewEvent( { ...calendarEvent, id: data.Event.id, user  }) );
        }
    };

    const startDeleteEvent = () => {
        // TODO: llegar al backend
        dispatch( onDeleteEvent() );
    };

    const startDeactivateEvent = () => {
        dispatch( onDeactivateEvent() );
    };

    const startLoadingEvents = async() => {
        try {
            const { data } = await calendarApi.get('/events');
            const dateEvents = convertEventsToDateEvents( data.events );
            console.log(dateEvents);
        } catch (error) {
            console.log('There was an error loading events');
            console.log(error);
        }
    };

    return {
        //* Properties
        events, 
        activeEvent,
        hasEventSelected: !!activeEvent,

        //* Methods
        setActiveEvent,
        startDeactivateEvent,
        startDeleteEvent,
        startLoadingEvents,
        startSavingEvent,
    };
}
