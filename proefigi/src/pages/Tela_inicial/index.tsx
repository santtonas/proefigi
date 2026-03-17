import './style.css';
import React, {useState} from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export function Tela_inicial(){
    const [date, setDate] = useState<Value>(new Date());

    return (
        <main className="conteudo-principal">
            <div className="conteiner-calendario">
                

                <Calendar onChange={setDate} value={date} showFixedNumberOfWeeks={true} calendarType="iso8601" locale="pt-BR"/>

               
            </div>

        </main>
    )
}