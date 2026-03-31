import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './index'

const meta = {
  title: 'Components/Table',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    h1: { control: 'text', name: 'Columna 1 (cabecera)' },
    h2: { control: 'text', name: 'Columna 2' },
    h3: { control: 'text', name: 'Columna 3' },
    r1a: { control: 'text', name: 'Fila 1 – col 1' },
    r1b: { control: 'text', name: 'Fila 1 – col 2' },
    r1c: { control: 'text', name: 'Fila 1 – col 3' },
    r2a: { control: 'text', name: 'Fila 2 – col 1' },
    r2b: { control: 'text', name: 'Fila 2 – col 2' },
    r2c: { control: 'text', name: 'Fila 2 – col 3' },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    h1: 'ID',
    h2: 'Nombre',
    h3: 'Rol',
    r1a: '1',
    r1b: 'Ana',
    r1c: 'Admin',
    r2a: '2',
    r2b: 'Luis',
    r2c: 'Editor',
  },
  render: ({ h1, h2, h3, r1a, r1b, r1c, r2a, r2b, r2c }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{h1}</TableHead>
          <TableHead>{h2}</TableHead>
          <TableHead>{h3}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>{r1a}</TableCell>
          <TableCell>{r1b}</TableCell>
          <TableCell>{r1c}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{r2a}</TableCell>
          <TableCell>{r2b}</TableCell>
          <TableCell>{r2c}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}
