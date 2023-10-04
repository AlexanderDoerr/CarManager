package UserAuth.UserAuth;

import org.springframework.data.annotation.Id;
import java.util.UUID;
import java.util.Date;



public class User {

    @Id
    UUID UserId;
    String FirstName;
    String LastName;
    Date DateOfBirth;
    String Email;
    int PhoneNumber;
    String Password;
    String Address;
    String City;
    State State;
    int ZipCode;

    public User() {
    }

    public User(UUID userId, String firstName, String lastName, Date dateOfBirth, String email, int phoneNumber, String password, String address, String city, State state, int zipCode) {
        UserId = userId;
        FirstName = firstName;
        LastName = lastName;
        DateOfBirth = dateOfBirth;
        Email = email;
        PhoneNumber = phoneNumber;
        Password = password;
        Address = address;
        City = city;
        State = state;
        ZipCode = zipCode;
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////
    public UUID getUserId() {
        return UserId;
    }

    public void setUserId(UUID userId) {
        UserId = userId;
    }

    public String getFirstName() {
        return FirstName;
    }

    public void setFirstName(String firstName) {
        FirstName = firstName;
    }

    public String getLastName() {
        return LastName;
    }

    public void setLastName(String lastName) {
        LastName = lastName;
    }

    public Date getDateOfBirth() {
        return DateOfBirth;
    }

    public void setDateOfBirth(Date dateOfBirth) {
        DateOfBirth = dateOfBirth;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String email) {
        Email = email;
    }

    public int getPhoneNumber() {
        return PhoneNumber;
    }

    public void setPhoneNumber(int phoneNumber) {
        PhoneNumber = phoneNumber;
    }

    public String getPassword() {
        return Password;
    }

    public void setPassword(String password) {
        Password = password;
    }

    public String getAddress() {
        return Address;
    }

    public void setAddress(String address) {
        Address = address;
    }

    public String getCity() {
        return City;
    }

    public void setCity(String city) {
        City = city;
    }

    public UserAuth.UserAuth.State getState() {
        return State;
    }

    public void setState(UserAuth.UserAuth.State state) {
        State = state;
    }

    public int getZipCode() {
        return ZipCode;
    }

    public void setZipCode(int zipCode) {
        ZipCode = zipCode;
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
}
