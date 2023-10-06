package UserAuth.UserAuth;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Table;
import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.UUID;

//@Entity
@Table(name = "User")
public class User {

//    @jakarta.persistence.Id
    @Id
    @GeneratedValue
    @Column(name = "UserId")
    private UUID UserId;

    @Column(name = "FirstName")
    private String FirstName;

    @Column(name = "LastName")
    private String LastName;

    @Column(name = "DateOfBirth")
    private Date DateOfBirth;

    @Column(name = "Email")
    private String Email;

    @Column(name = "PhoneNumber")
    private int PhoneNumber;

    @Column(name = "Password")
    private String Password;

    @Column(name = "Address")
    private String Address;

    @Column(name = "City")
    private String City;

    @Column(name = "State")
    private State State;

    @Column(name = "ZipCode")
    private int ZipCode;



    public User() {
    }

    public User(String firstName, String lastName, Date dateOfBirth, String email, int phoneNumber, String password, String address, String city, State state, int zipCode) {

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
