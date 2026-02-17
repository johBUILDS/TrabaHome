import React from 'react';
import { Upload, CheckCircle, X, ArrowRight, Loader2 } from 'lucide-react';
import type { StepThreeProps } from '../../types/Worker.types.ts';
import { professionOptions, pangasinanCities } from '../../constants/SignUpData.ts';

// Barangays by city/municipality
const barangaysByCity: { [key: string]: string[] } = {
  'Alaminos City': [
    'Alos',
    'Amandiego',
    'Amangbangan',
    'Balangobong',
    'Balayang',
    'Bisocol',
    'Bolaney',
    'Bued',
    'Cabatuan',
    'Cayucay',
    'Dulacac',
    'Inerangan',
    'Landoc',
    'Linmansangan',
    'Lucap',
    'Maawi',
    'Macatiw',
    'Magsaysay',
    'Mona',
    'Palamis',
    'Pangapisan',
    'Pandan',
    'Poblacion',
    'Pocal-Pocal',
    'Polo',
    'Quibuar',
    'Sabangan',
    'San Antonio',
    'San Jose',
    'San Roque',
    'San Vicente',
    'Santa Maria',
    'Tanaytay',
    'Tangcarang',
    'Tawintawin',
    'Tocok',
    'Tukey'
  ],
  'Dagupan City': [
    'Bacayao Norte',
    'Bacayao Sur',
    'Barangay I (Poblacion)',
    'Barangay II (Poblacion)',
    'Barangay III (Poblacion)',
    'Barangay IV (Poblacion)',
    'Bolosan',
    'Bonuan Binloc',
    'Bonuan Boquig',
    'Bonuan Gueset',
    'Calmay',
    'Carael',
    'Caranglaan',
    'Herrero',
    'Lasip Chico',
    'Lasip Grande',
    'Lomboy',
    'Lucao',
    'Malued',
    'Mamalingling',
    'Mangin',
    'Mayombo',
    'Pantal',
    'Poblacion Oeste',
    'Pogo Chico',
    'Pogo Grande',
    'Pugaro Suit',
    'Salapingao',
    'Salisay',
    'Tambac',
    'Tapuac',
    'Tebeng'
  ],
  'San Carlos City': [
    'Abanon',
    'Agdao',
    'Anando',
    'Ano',
    'Antipangol',
    'Aponit',
    'Bacnar',
    'Balaya',
    'Balayong',
    'Baldog',
    'Balite Sur',
    'Bangos',
    'Bani',
    'Barukbuk',
    'Bocboc',
    'Bogaoan',
    'Bolosan',
    'Bonifacio (Poblacion)',
    'Buenglat',
    'Bugallon-Posadas',
    'Cacaritan',
    'Calancuasan',
    'Calepaan',
    'Calobaoan',
    'Calomboyan',
    'Capataan',
    'Caoayan-Kiling',
    'Cobol',
    'Coliling',
    'Cruz',
    'Doyong',
    'Gamata',
    'Guelew',
    'Ilang',
    'Inerangan',
    'Isla',
    'Libas',
    'Lilimasan',
    'Longos',
    'Lucban (Poblacion)',
    'Mabalbalino',
    'Mabini (Poblacion)',
    'Magtaking',
    'Malacañang',
    'Maliwara',
    'Mamarlao',
    'Manzon',
    'Matagdem',
    'Mestizo Norte',
    'Naguilayan',
    'Nilentap',
    'Padilla',
    'Palaming',
    'Palaris (Poblacion)',
    'Palospos',
    'Pangalangan',
    'Pangoloan',
    'Pangpang',
    'Paitan-Panoypoy',
    'Payapa',
    'Payar',
    'Perez Boulevard (Poblacion)',
    'Polo',
    'Quezon Boulevard (Poblacion)',
    'Quintong',
    'Rajal Centro',
    'Rizal Avenue (Poblacion)',
    'Salinap',
    'San Juan',
    'San Pedro (Poblacion)',
    'Sapinit',
    'Supo',
    'Talang',
    'Tamayo',
    'Tandoc',
    'Tarece',
    'Tarectec',
    'Tatarao',
    'Turac',
    'Libas',
    'M. Soriano (Poblacion)'
  ],
  'Urdaneta City': [
    'Anonas',
    'Bactad East',
    'Bayaoas',
    'Bolaoen',
    'Cabaruan',
    'Cabuloan',
    'Camanang',
    'Camantiles',
    'Casantaan',
    'Catablan',
    'Cayambanan',
    'Consolacion',
    'Dilan Paurido',
    'Dr. Pedro T. Orata (Bactad Proper)',
    'Labit Proper',
    'Labit West',
    'Mabanogbog',
    'Macalong',
    'Nancalobasaan',
    'Nancamaliran East',
    'Nancamaliran West',
    'Nancayasan',
    'Oltama',
    'Palina East',
    'Palina West',
    'Panaga',
    'Pinmaludpod',
    'Poblacion',
    'San Jose',
    'San Vicente',
    'Santa Lucia',
    'Santo Domingo',
    'Sugcong',
    'Tipuso',
    'Tulong'
  ],
};

const StepThree: React.FC<StepThreeProps> = ({ 
  formData,
  errors,
  onInputChange,
  onProofOfWorkUpload, 
  onSubmit,
  isLoading
}) => {
  const availableBarangays = formData.city ? (barangaysByCity[formData.city] || []) : [];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Work & Location Details</h2>
      <div className="space-y-3">

        {/* Profession */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-700 uppercase tracking-tight">Work Information</label>
          <select 
            name="profession"
            value={formData.profession || ''}
            onChange={onInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none appearance-none bg-white"
          >
            <option value="" disabled>Select your Profession</option>
            {professionOptions.map(profession => (
              <option key={profession} value={profession}>{profession}</option>
            ))}
          </select>
          {errors?.profession && (
            <p className="text-[10px] text-red-500 px-1">{errors.profession}</p>
          )}
        </div>

        {/* Province (display only) */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-700 uppercase tracking-tight">Location Information</label>
          <div className="flex bg-gray-100 rounded-lg overflow-hidden">
            <div className="px-4 py-3 text-xs text-gray-500 font-semibold border-r border-gray-200">Province</div>
            <div className="px-4 py-3 text-xs text-gray-500 font-semibold">Pangasinan</div>
          </div>
          <p className="text-[9px] text-gray-400 italic px-1">Currently serving selected areas in Pangasinan.</p>
        </div>

        {/* City */}
        <div className="space-y-1 pt-1">
          <label className="text-[11px] font-bold text-gray-700 uppercase tracking-tight">City / Municipality</label>
          <select 
            name="city"
            value={formData.city || ''}
            onChange={(e) => {
              onInputChange(e);
              const barangayEvent = {
                target: {
                  name: 'barangay',
                  value: ''
                }
              } as React.ChangeEvent<HTMLSelectElement>;
              onInputChange(barangayEvent);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none appearance-none bg-white"
          >
            <option value="" disabled>Select your City / Municipality</option>
            {pangasinanCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          {errors?.city && (
            <p className="text-[10px] text-red-500 px-1">{errors.city}</p>
          )}
        </div>

        {/* Barangay */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-700 uppercase tracking-tight">Barangay</label>
          <select 
            name="barangay"
            value={formData.barangay || ''}
            onChange={onInputChange}
            disabled={!formData.city}
            className={`w-full p-3 rounded-lg text-sm outline-none ${
              formData.city
                ? 'border border-gray-300 bg-white' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <option value="">Select Barangay</option>
            {availableBarangays.map(barangay => (
              <option key={barangay} value={barangay}>{barangay}</option>
            ))}
          </select>
          {!formData.city && (
            <p className="text-[9px] text-gray-400 italic px-1">Please select a city first</p>
          )}
          {formData.city && availableBarangays.length === 0 && (
            <p className="text-[9px] text-orange-500 italic px-1">Barangay data not yet available for this city</p>
          )}
          {errors?.barangay && (
            <p className="text-[10px] text-red-500 px-1">{errors.barangay}</p>
          )}
        </div>
      </div>

      {/* Proof of Work */}
      <div className="space-y-2 mt-4">
        <label className="text-[11px] font-bold text-gray-700">Proof of Work (Optional)</label>
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="relative">
              {formData.proofOfWorkPreviews && formData.proofOfWorkPreviews[i] ? (
                <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 h-20 group">
                  <img 
                    src={formData.proofOfWorkPreviews[i]} 
                    alt={`Proof of work ${i + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const fakeEvent = { 
                        target: { 
                          files: null,
                          dataset: { index: i.toString() } 
                        } 
                      };
                      onProofOfWorkUpload(fakeEvent as any);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <X size={10} />
                  </button>
                  <div className="absolute bottom-1 left-1 bg-green-500 text-white px-1.5 py-0.5 rounded text-[8px] font-bold flex items-center gap-0.5">
                    <CheckCircle size={8} />
                    <span>{i + 1}</span>
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-300 rounded-lg h-20 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden">
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    data-index={i}
                    onChange={onProofOfWorkUpload} 
                  />
                  <Upload size={16} className="text-gray-400 mb-1" />
                  <span className="text-[8px] text-gray-400 font-bold">{i + 1}</span>
                </label>
              )}
            </div>
          ))}
        </div>
        <p className="text-[9px] text-gray-400 italic leading-tight">
          Upload clear photos of jobs, before and after shots, or in-progress work (up to 4 photos).
        </p>
      </div>

      {/* Submit Button */}
      <button
        onClick={onSubmit}
        disabled={isLoading}
        className={`
          relative w-full mt-2 px-6 py-3.5 rounded-xl font-semibold text-sm
          flex items-center justify-center gap-2
          transition-all duration-200 ease-in-out
          overflow-hidden group
          ${isLoading
            ? 'bg-[#004A8C] cursor-not-allowed text-white/80'
            : 'bg-[#004A8C]  text-white shadow-md'
          }
        `}
      >
        {/* Shimmer effect on hover */}
        {!isLoading && (
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
        )}

        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <span>Submit Application</span>
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </>
        )}
      </button>
    </div>
  );
};

export default StepThree;