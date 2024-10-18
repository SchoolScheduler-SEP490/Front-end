import { Button, Box } from "@mui/material";

const GoogleMapSection = () => {
  return (
    <section className="w-full">
      <Box className="container mx-auto" sx={{ maxWidth: "1200px", textAlign: "center", position: "relative" }}>
        <Box
          sx={{
            position: "relative",
            paddingBottom: "50%",
            height: 0,
            overflow: "hidden",
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.7475458136716!2d106.6558117147444!3d10.762622992330614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ebe1e56e607%3A0x536af54e6a1780e9!2zVHLGsOG7nW5nIMSR4buZaSDEkMOgIHThu6sgSG_DoCBGUFQgVFAgSENN!5e0!3m2!1sen!2s!4v1639476244444!5m2!1sen!2s"
            style={{
              border: 0,
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map"
          />
        </Box>

        <Button
          className="bg-primary-300 text-white"
          variant="contained"
          href="https://www.google.com/maps/dir//%C4%91%E1%BA%A1i+h%E1%BB%8Dc+fpt/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x31752731176b07b1:0xb752b24b379bae5e?sa=X&ved=1t:3061&ictx=111"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            position: "absolute", 
            bottom: 50, 
            left: "50%", 
            transform: "translateX(-50%)", 
          }}
        >
          Xem trong Google Maps
        </Button>
      </Box>
    </section>
  );
};

export default GoogleMapSection;
