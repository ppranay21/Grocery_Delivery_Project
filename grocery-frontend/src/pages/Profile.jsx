import { useEffect, useState } from "react";
import { MapPin, Save, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
};

function Profile() {
  const { currentUser, updateCurrentUserName } = useAuth();

  const [formData, setFormData] = useState(emptyForm);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await API.get("/profile");

        setFormData({
          fullName: response.data.fullName || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          address: response.data.address || "",
          city: response.data.city || "",
          state: response.data.state || "",
          zipCode: response.data.zipCode || "",
        });
      } catch (error) {
        const message =
          error.response?.data?.message || "Unable to load profile";

        toast.error(message);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setFieldErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setFieldErrors({});

      const response = await API.put("/profile", {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      });

      setFormData((previousForm) => ({
        ...previousForm,
        fullName: response.data.fullName,
        phone: response.data.phone,
        address: response.data.address,
        city: response.data.city,
        state: response.data.state,
        zipCode: response.data.zipCode,
      }));

      updateCurrentUserName(response.data.fullName);

      toast.success("Profile updated successfully");
    } catch (error) {
      const backendErrors = error.response?.data?.errors || {};
      const message =
        error.response?.data?.message || "Unable to update profile";

      setFieldErrors(backendErrors);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="profile-page">
        <p className="products-message">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <UserRound size={40} />
        </div>

        <div>
          <h1>My Profile</h1>
          <p>Manage your account and saved delivery address.</p>
        </div>
      </div>

      <div className="profile-layout">
        <div className="profile-summary-card">
          <div className="profile-summary-icon">
            <UserRound size={32} />
          </div>

          <h2>{formData.fullName || currentUser?.name}</h2>
          <p>{formData.email}</p>

          <span className="profile-role">
            {currentUser?.role === "ADMIN" ? "Administrator" : "Customer"}
          </span>

          <div className="saved-address-preview">
            <MapPin size={20} />

            <div>
              <h3>Saved Address</h3>

              {formData.address ? (
                <p>
                  {formData.address}
                  <br />
                  {formData.city}, {formData.state} {formData.zipCode}
                </p>
              ) : (
                <p>No delivery address saved yet.</p>
              )}
            </div>
          </div>
        </div>

        <form className="profile-form" onSubmit={handleUpdateProfile}>
          <h2>Account Details</h2>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleChange}
            />
            {fieldErrors.fullName && (
              <p className="field-error">{fieldErrors.fullName}</p>
            )}
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={formData.email}
              disabled
            />
            <p className="form-help-text">
              Email cannot be changed from this page.
            </p>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />
            {fieldErrors.phone && (
              <p className="field-error">{fieldErrors.phone}</p>
            )}
          </div>

          <h2 className="profile-address-title">Saved Delivery Address</h2>

          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter street address"
              value={formData.address}
              onChange={handleChange}
            />
            {fieldErrors.address && (
              <p className="field-error">{fieldErrors.address}</p>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
              />
              {fieldErrors.city && (
                <p className="field-error">{fieldErrors.city}</p>
              )}
            </div>

            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
              />
              {fieldErrors.state && (
                <p className="field-error">{fieldErrors.state}</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Zip Code</label>
            <input
              type="text"
              name="zipCode"
              placeholder="Zip code"
              value={formData.zipCode}
              onChange={handleChange}
            />
            {fieldErrors.zipCode && (
              <p className="field-error">{fieldErrors.zipCode}</p>
            )}
          </div>

          <button
            type="submit"
            className="profile-save-btn"
            disabled={saving}
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
