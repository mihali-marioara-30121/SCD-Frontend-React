// components/EmployeeManagementPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
} from '@mui/material';

const EmployeeManagementPage = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/department/all', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });
        setDepartments(response.data || []);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  // Fetch employees and managers when the selected department changes
  useEffect(() => {
    const fetchEmployeesAndManagers = async () => {
      if (selectedDepartment) {
        try {
          const responseEmployees = await axios.get(
            `http://localhost:8080/api/v1/employee/byDepartament/employees/${selectedDepartment.name}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              },
            }
          );
          setEmployees(responseEmployees.data || []);

          const responseManagers = await axios.get(
            `http://localhost:8080/api/v1/employee/byDepartament/managers/${selectedDepartment.name}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              },
            }
          );
          setManagers(responseManagers.data || []);
        } catch (error) {
          console.error('Error fetching employees and managers:', error);
        }
      }
    };

    fetchEmployeesAndManagers();
  }, [selectedDepartment]);

  const handleCheckboxChange = (type, employee) => {
    if (type === 'employee') {
      setSelectedEmployees((prev) =>
        prev.includes(employee.id)
          ? prev.filter((id) => id !== employee.id)
          : [...prev, employee.id]
      );
    } else {
      setSelectedManagers((prev) =>
        prev.includes(employee.id)
          ? prev.filter((id) => id !== employee.id)
          : [...prev, employee.id]
      );
    }
  };

  const handleSendEmail = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleConfirmSendEmail = async () => {
    try {
      if (selectedEmployees.length === 0 && selectedManagers.length === 0) {
        setSnackbarMessage('Please select at least one employee or manager.');
        setOpenSnackbar(true);
        return;
      }

      if (!emailSubject || !emailContent) {
        setSnackbarMessage('Subject and content cannot be empty.');
        setOpenSnackbar(true);
        return;
      }

      // Send email to selected employees
      await axios.post(
        'http://localhost:8080/api/v1/email',
        {
          subject: emailSubject,
          message: emailContent,
          recipientDetailsList: [...selectedEmployees, ...selectedManagers].map((id) => {
            const employee = [...employees, ...managers].find(
              (emp) => emp.id === id
            );
            return {
              name: employee ? employee.name : 'Unknown Employee/Manager',
              email: employee ? employee.email : '',
            };
          }),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      // Clear selected employees and close the dialog after sending email
      setSelectedEmployees([]);
      setSelectedManagers([]);
      setEmailSubject('');
      setEmailContent('');
      setOpenDialog(false);

      setSnackbarMessage('Email sent successfully.');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error sending email:', error);
      setSnackbarMessage('Sending email failed.');
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <FormControl fullWidth style={{ width: 100, margin: '30px 0' }}>
        <InputLabel htmlFor="department-select">Select Department</InputLabel>
        <Select
          label="Select Department"
          value={selectedDepartment ? selectedDepartment.name : ''}
          onChange={(e) => {
            const selected = departments.find(
              (dept) => dept.name === e.target.value
            );
            setSelectedDepartment(selected);
          }}
          inputProps={{ name: 'department', id: 'department-select' }}
        >
          {departments.map((dept) => (
            <MenuItem key={dept.id} value={dept.name}>
              {dept.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedDepartment && (
        <Box mt={2} width="80%">
          <Typography variant="h5">Employees and Managers in {selectedDepartment.name}</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Manager</TableCell>
                  <TableCell>Select</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...employees, ...managers].map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.manager ? employee.manager.name : 'N/A'}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={
                          (employee.manager && selectedManagers.includes(employee.id)) ||
                          (!employee.manager && selectedEmployees.includes(employee.id))
                        }
                        onChange={() =>
                          handleCheckboxChange(
                            employee.manager ? 'manager' : 'employee',
                            employee
                          )
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button variant="contained" color="primary" onClick={handleSendEmail}>
            Send Email
          </Button>
        </Box>
      )}

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Send Email</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">Selected Employees/Managers:</Typography>
          <ul>
            {[...selectedEmployees, ...selectedManagers].map((id) => {
              const employee = [...employees, ...managers].find(
                (emp) => emp.id === id
              );
              return (
                <li key={id}>
                  {employee ? employee.name : 'Unknown Employee/Manager'}
                </li>
              );
            })}
          </ul>
          <TextField
            label="Subject"
            variant="outlined"
            fullWidth
            margin="normal"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
          />
          <TextField
            label="Content"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmSendEmail} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default EmployeeManagementPage;
