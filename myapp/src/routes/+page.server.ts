import type { Actions, PageServerLoad } from './$types';
import { myDayPool } from '$lib/db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export interface Employee {
    id: number;
    name: string;
    role: string;
    email: string;
}

export const load: PageServerLoad = async () => {
    const [rows, fields] = await myDayPool.query<RowDataPacket[]>('SELECT id,name,role,email FROM details');
    return { employees: rows as Employee[] };
};

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const action = formData.get('action');
        const name = formData.get('name') as string;
        const role = formData.get('role') as string;
        const email = formData.get('email') as string;

        if (action === 'edit') {
            const id = Number(formData.get('id'));
            await myDayPool.query<ResultSetHeader>(
                'UPDATE details SET name = ?, role = ?, email = ? WHERE id = ?',
                [name, role, email, id]
            );
        } 
        else if (action === 'delete') {
            const id = Number(formData.get('id'));
            await myDayPool.query<ResultSetHeader>(
                'DELETE FROM details WHERE id = ?',
                [id]
            );
        } 
        else {
            await myDayPool.query<ResultSetHeader>(
                'INSERT INTO details (name, role, email) VALUES (?, ?, ?)',
                [name, role, email]
            );
        }

        return { success: true };
    }
};
