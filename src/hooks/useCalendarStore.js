import { useDispatch, useSelector } from "react-redux"
import Swal from "sweetalert2";
import { calendarApi } from "../api";
import { convertEventsToDateEvents } from "../helpers";
import {
    onAddNewEvent,
    onDeleteEvent,
    onSetActiveEvent,
    onUpdateEvent,
    onDeactivateEvent,
    onLoadEvents,
} from "../store";


export const useCalendarStore = () => {

    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector( state => state.calendar);
    const { user } = useSelector( state => state.auth );
    
    const setActiveEvent = ( calendarEvent ) => {
        dispatch( onSetActiveEvent( calendarEvent ) );
    };

    const startSavingEvent = async( calendarEvent ) => {

        try {
            if( calendarEvent.id ) {
                //* Actualizando
                await calendarApi.put(`/events/${ calendarEvent.id }`, calendarEvent );
                dispatch( onUpdateEvent({ ...calendarEvent, user }) );
                return;
            } 
    
            //* creando
            const { data } = await calendarApi.post( '/events', calendarEvent );
            dispatch( onAddNewEvent( { ...calendarEvent, id: data.Event.id, user  }) );
            
        } catch (error) {
            console.log(error);
            Swal.fire('Error al guardar', error.response.data.msg, 'error');
        }
        

    };

    const startDeleteEvent = async() => {
        // TODO: llegar al backend
        try {
            
            //* Eliminando
            await calendarApi.delete(`/events/${ activeEvent.id }`, );
            dispatch( onDeleteEvent() );
            return;

        } catch (error) {
         console.log(error);
         Swal.fire('Error al eliminar', error.response.data.msg, 'error');
        }

        
    };

    const startDeactivateEvent = () => {
        dispatch( onDeactivateEvent() );
    };

    const startLoadingEvents = async() => {
        try {
            const { data } = await calendarApi.get('/events');
            const dateEvents = convertEventsToDateEvents( data.events );
            dispatch( onLoadEvents( dateEvents ) );
        
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
