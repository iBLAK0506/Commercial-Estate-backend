function PropertyDetailPage() {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  // ... rest of your state and useEffect

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="propertyDetails">
      {/*
        THE FIX:
        This check ensures the Slider only renders if 'property.images' exists
        AND has a length greater than 0.
      */}
      {property?.images?.length > 0 && <Slider images={property.images} />}

      <h1>{property?.title}</h1>
      <p>{property?.address}</p>
      {/* ... rest of the component */}
    </div>
  );
}
