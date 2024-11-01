import * as Yup from 'yup';

export const roomSchema = Yup.object().shape({
  name: Yup.string().required('Tên phòng là bắt buộc'),
  'room-code': Yup.string().required('Mã phòng là bắt buộc'),
  'max-class-per-time': Yup.number()
    .required('Số lớp tối đa là bắt buộc')
    .min(1, 'Số lớp tối đa phải lớn hơn 0'),
  'building-code': Yup.string().required('Tòa nhà là bắt buộc'),
  'room-type': Yup.string().required('Loại phòng là bắt buộc'),
  'subjects-abreviation': Yup.array().when('room-type', {
    is: 'PRACTICE_ROOM',
    then: (schema) => schema.of(Yup.string()).min(1, 'Phải chọn ít nhất một môn học'),
    otherwise: (schema) => schema.nullable()
  })
});

export const updateRoomSchema = Yup.object().shape({
  name: Yup.string().required('Tên phòng là bắt buộc'),
  'room-code': Yup.string().required('Mã phòng là bắt buộc'),
  'max-class-per-time': Yup.number()
    .required('Số lớp tối đa là bắt buộc')
    .min(1, 'Số lớp tối đa phải lớn hơn 0'),
  'building-id': Yup.number().required('Tòa nhà là bắt buộc'),
  'room-type': Yup.string().required('Loại phòng là bắt buộc'),
  'subjects-ids': Yup.array().when('room-type', {
    is: 'PRACTICE_ROOM',
    then: (schema) => schema.of(Yup.string()).min(1, 'Phải chọn ít nhất một môn học'),
    otherwise: (schema) => schema.nullable()
}),
  'availabilitye-status': Yup.string().required('Trạng thái là bắt buộc'),
})