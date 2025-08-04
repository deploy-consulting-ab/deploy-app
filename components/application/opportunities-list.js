import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export function OpportunitiesListComponent({data}) {

    const { opportunities, totalAmount } = data;
    return (
        <Table>
            <TableCaption>Opportunity pipeline</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {opportunities.map((opportunity) => (
                    <TableRow key={opportunity.id}>
                        <TableCell className="font-medium">{opportunity.id}</TableCell>
                        <TableCell>{opportunity.name}</TableCell>
                        <TableCell>{opportunity.stage}</TableCell>
                        <TableCell className="text-right">{opportunity.amount} {opportunity.currency}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">{totalAmount} SEK</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
}
