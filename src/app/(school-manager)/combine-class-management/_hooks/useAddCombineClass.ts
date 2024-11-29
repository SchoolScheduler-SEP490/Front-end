import useNotify from "@/hooks/useNotify";
import { IAddCombineClassRequest } from "../_libs/constants";
import { addCombineClass } from "../_libs/apiCombineClass";

interface ICombineClassProps {
    sessionToken: string;
    requestData: IAddCombineClassRequest;   
}

const useAddCombineClass = async (props: ICombineClassProps) => {
    const { sessionToken, requestData } = props;
    try {
        const response = await addCombineClass(sessionToken, requestData);
        useNotify({
            message: 'Thêm lớp ghép thành công',
            type: 'success',
        });
        return response;
    } catch (err: any) {
        useNotify({
            message: 'Thêm lớp ghép thất bại. Vui lòng thử lại.',
            type: 'error',
        });
    }
}
export default useAddCombineClass