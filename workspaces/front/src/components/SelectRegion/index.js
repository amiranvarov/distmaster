import * as React from 'react'
import { Field } from 'redux-form'


export const SelectRegion = ({name}) => (
  <Field
    name={name}
    component="select"
  >
    <option value="none">Не указано</option>
    <option value="Ахангаран">Ахангаран</option>
    <option value="Алмалык">Алмалык</option>
    <option value="Ангрен">Ангрен</option>
    <option value="Пискент">Пискент</option>
    <option value="Бука">Бука</option>
    <option value="Нурафшан (Туйтепа)">Нурафшан (Туйтепа)</option>
    <option value="all">Все регионы</option>
  </Field>
);

export default SelectRegion
