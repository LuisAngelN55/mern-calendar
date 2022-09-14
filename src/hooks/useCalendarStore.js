import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent, onDeactivateEvent } from "../store";


export const useCalendarStore = () => {

    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector( state => state.calendar);
    
    const setActiveEvent = ( calendarEvent ) => {
        dispatch( onSetActiveEvent( calendarEvent ) );
    };

    const startSavingEvent = async( calendarEvent ) => {
        //TODO: llegar al backend
        //Todo bien
        if( calendarEvent._id ) {
            //* Actualizando
            dispatch( onUpdateEvent({ ...calendarEvent }) );
        } else {
            //* creando
            dispatch( onAddNewEvent( { ...calendarEvent, _id: new Date().getTime() }) );
        }
    };

    const startDeleteEvent = () => {
        // TODO: llegar al backend
        dispatch( onDeleteEvent() );
    };

    const startDeactivateEvent = () => {
        dispatch( onDeactivateEvent() );
    };


    return {
        //* Properties
        events, 
        activeEvent,
        hasEventSelected: !!activeEvent,

        //* Methods
        setActiveEvent,
        startSavingEvent,
        startDeleteEvent,
        startDeactivateEvent,
    };
}
