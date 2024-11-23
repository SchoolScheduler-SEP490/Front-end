import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';

export interface IConstraintsSidenavData {
	category: string;
	items: IDropdownOption<string>[];
}
