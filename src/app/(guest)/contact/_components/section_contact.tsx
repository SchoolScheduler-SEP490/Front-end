import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  Box,
} from "@mui/material";

const ContactSection = () => {
  return (
    <section className="w-full py-12 mx-[10%]">
      <Box className="container mx-auto" sx={{ maxWidth: "1000px" }}>
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
          <Box flex={{ xs: "1", md: "2" }}>
            <Typography
              variant="h4"
              sx={{ marginBottom: "1.5rem", fontWeight: 600 }}
            >
              Để lại thông tin liên hệ
            </Typography>

            <form className="space-y-6">
              <Box
                display="flex"
                gap={4}
                flexDirection={{ xs: "column", sm: "row" }}
              >
                <TextField
                  id="full-name"
                  label="Họ và tên"
                  fullWidth
                  variant="standard"
                />
                <TextField
                  id="phone-number"
                  label="Số điện thoại"
                  fullWidth
                  variant="standard"
                />
              </Box>

              <TextField
                id="email"
                label="Địa chỉ email"
                fullWidth
                variant="standard"
              />

              <TextField
                id="message"
                label="Tin nhắn của bạn"
                fullWidth
                multiline
                rows={4}
                variant="standard"
              />

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <FormControlLabel
                  control={<Checkbox color="primary" />}
                  label="Đăng ký nhận thông tin từ chúng tôi"
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ padding: "10px 24px" }}
                >
                  Gửi thông tin
                </Button>
              </Box>
            </form>
          </Box>

          <Box flex={{ xs: "1", md: "2" }}>
            <Box
              sx={{
                padding: "2rem",
                backgroundColor: "#EEF4F8",
                borderRadius: "8px",
                boxShadow: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{ marginBottom: "1rem", fontWeight: "bold" }}
              >
                Our Information
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ marginBottom: "0.5rem" }}
              >
                1234 Education Lane, Learning City, EDFG States 56789
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ marginBottom: "0.5rem" }}
              >
                admission@edmunhigh.edu
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ marginBottom: "0.5rem" }}
              >
                +1 (555) 123 - 4567
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </section>
  );
};

export default ContactSection;
